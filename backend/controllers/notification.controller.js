


// Save subscription when user enables notifications
export const saveSubscription = async (request) => {
  try {
    // ===== VALIDATION =====
    // Check if user is authenticated
    const user = request.user;
    if (!user) {
      throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, "You must be logged in to save notifications");
    }

    // Validate required parameters
    const { endpoint, keys } = request.params;
    if (!endpoint) {
      throw new Parse.Error(Parse.Error.INVALID_JSON, "Endpoint is required");
    }
    
    if (!keys || !keys.p256dh || !keys.auth) {
      throw new Parse.Error(Parse.Error.INVALID_JSON, "Valid subscription keys are required");
    }

    // ===== CHECK FOR EXISTING SUBSCRIPTION =====
    const PushSubscription = Parse.Object.extend("PushSubscription");
    const query = new Parse.Query(PushSubscription);
    
    query.equalTo("user", user);
    query.equalTo("endpoint", endpoint);
    
    let subscription = await query.first({ useMasterKey: true });

    // ===== CREATE OR UPDATE SUBSCRIPTION ACCORDING TO REQUIREMENTS =====
    if (!subscription) {
      // Case 1: Subscription doesn't exist - Create new with active = true
      subscription = new PushSubscription();
      subscription.set("user", user);
      subscription.set("endpoint", endpoint);
      subscription.set("p256dh", keys.p256dh);
      subscription.set("auth", keys.auth);
      subscription.set("active", true); // New subscription is active
      subscription.set("lastUsed", new Date());
      
      // Optional: Store browser info
      const userAgent = request.headers?.['user-agent'];
      if (userAgent) {
        subscription.set("userAgent", userAgent);
      }
      
      await subscription.save(null, { useMasterKey: true });
      
      console.log("Created new active subscription for user:", user.id);
      
      return {
        success: true,
        message: "Subscription saved successfully",
        subscriptionId: subscription.id,
        status: "created",
        active: true
      };
      
    } else {
      // Case 2: Subscription exists
      const currentActiveStatus = subscription.get("active");
      
      if (currentActiveStatus === true) {
        // Case 2a: Subscription exists and is active - Set active = false
        subscription.set("active", false);
        subscription.set("deactivatedAt", new Date());
        subscription.set("lastUsed", new Date());
        
        await subscription.save(null, { useMasterKey: true });
        
        console.log("Deactivated existing active subscription for user:", user.id);
        
        return {
          success: true,
          message: "Subscription deactivated successfully",
          subscriptionId: subscription.id,
          status: "deactivated",
          active: false
        };
        
      } else {
        // Case 2b: Subscription exists but is inactive - Reactivate with new keys
        subscription.set("p256dh", keys.p256dh);
        subscription.set("auth", keys.auth);
        subscription.set("active", true);
        subscription.set("lastUsed", new Date());
        subscription.unset("deactivatedAt"); // Remove deactivation timestamp
        
        // Update browser info
        const userAgent = request.headers?.['user-agent'];
        if (userAgent) {
          subscription.set("userAgent", userAgent);
        }
        
        await subscription.save(null, { useMasterKey: true });
        
        console.log("Reactivated subscription for user:", user.id);
        
        return {
          success: true,
          message: "Subscription reactivated successfully",
          subscriptionId: subscription.id,
          status: "reactivated",
          active: true
        };
      }
    }

  } catch (error) {
    // ===== ERROR HANDLING =====
    console.error("Error in save-subscription:", {
      message: error.message,
      code: error.code,
      userId: request.user?.id
    });

    if (error instanceof Parse.Error) {
      throw error;
    }

    throw new Parse.Error(
      Parse.Error.INTERNAL_SERVER_ERROR,
      error.message || "Failed to save subscription"
    );
  }
};

// Check if user has active subscription
export const checkSubscription = async (request) => {
  const user = request.user;

  if (!user) {
    throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, "User not authenticated");
  }

  try {
    const Subscription = Parse.Object.extend("PushSubscription");
    const query = new Parse.Query(Subscription);
    query.equalTo("user", user);
    query.equalTo("active", true);
    
    const count = await query.count({ useMasterKey: true });
    
    // Also get the active subscription details if exists
    let activeSubscription = null;
    if (count > 0) {
      const subscriptions = await query.find({ useMasterKey: true, limit: 1 });
      if (subscriptions.length > 0) {
        const sub = subscriptions[0];
        activeSubscription = {
          id: sub.id,
          endpoint: sub.get("endpoint"),
          lastUsed: sub.get("lastUsed"),
          createdAt: sub.get("createdAt")
        };
      }
    }

    return {
      hasSubscription: count > 0,
      subscriptionCount: count,
      activeSubscription: activeSubscription
    };

  } catch (error) {
    console.error("Error checking subscription:", error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, error.message);
  }
};

// Deactivate subscription (soft delete)
export const deactivateSubscription = async (request) => {
  try {
    const user = request.user;
    if (!user) {
      throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, "Unauthorized");
    }

    const { subscriptionId, endpoint } = request.params;
    
    const PushSubscription = Parse.Object.extend("PushSubscription");
    const query = new Parse.Query(PushSubscription);
    
    query.equalTo("user", user);
    
    if (subscriptionId) {
      query.equalTo("objectId", subscriptionId);
    } else if (endpoint) {
      query.equalTo("endpoint", endpoint);
    } else {
      // If no specific subscription, deactivate all active ones
      query.equalTo("active", true);
    }
    
    const subscriptions = await query.find({ useMasterKey: true });
    
    if (subscriptions.length === 0) {
      return {
        success: true,
        message: "No active subscriptions found to deactivate",
        deactivatedCount: 0
      };
    }

    // Deactivate all found subscriptions
    const updatePromises = subscriptions.map(async (subscription) => {
      subscription.set("active", false);
      subscription.set("deactivatedAt", new Date());
      return subscription.save(null, { useMasterKey: true });
    });

    await Promise.all(updatePromises);

    return {
      success: true,
      message: `Deactivated ${subscriptions.length} subscription(s) successfully`,
      deactivatedCount: subscriptions.length
    };

  } catch (error) {
    console.error("Error in deactivate-subscription:", error);
    throw error;
  }
};

// Get subscription status for current user
export const getSubscriptionStatus = async (request) => {
  const user = request.user;

  if (!user) {
    throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, "User not authenticated");
  }

  try {
    const Subscription = Parse.Object.extend("PushSubscription");
    const query = new Parse.Query(Subscription);
    query.equalTo("user", user);
    query.descending("updatedAt");
    
    const subscriptions = await query.find({ useMasterKey: true });
    
    const activeSubscriptions = subscriptions.filter(sub => sub.get("active") === true);
    const inactiveSubscriptions = subscriptions.filter(sub => sub.get("active") === false);

    return {
      totalSubscriptions: subscriptions.length,
      activeCount: activeSubscriptions.length,
      inactiveCount: inactiveSubscriptions.length,
      hasActiveSubscription: activeSubscriptions.length > 0,
      subscriptions: subscriptions.map(sub => ({
        id: sub.id,
        endpoint: sub.get("endpoint"),
        active: sub.get("active"),
        lastUsed: sub.get("lastUsed"),
        createdAt: sub.get("createdAt"),
        updatedAt: sub.get("updatedAt"),
        deactivatedAt: sub.get("deactivatedAt")
      }))
    };

  } catch (error) {
    console.error("Error getting subscription status:", error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, error.message);
  }
};