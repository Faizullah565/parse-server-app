import { 
    checkSubscription,
    deactivateSubscription,
    getSubscriptionStatus,
    saveSubscription,
} from "../controllers/notification.controller.js"

Parse.Cloud.define("save-subscription", saveSubscription)
Parse.Cloud.define("check-subscription", checkSubscription)
Parse.Cloud.define("deactivate-subscription", deactivateSubscription)
Parse.Cloud.define("get-subscription-status", getSubscriptionStatus)