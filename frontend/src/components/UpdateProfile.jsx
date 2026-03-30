import { useState } from "react";
import { TextField, Button, Box, Avatar, Typography } from "@mui/material";
import axios from "axios";
import { uploadImage } from "../services/productServices";
import { getUserProfile } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { saveUser } from "../../utils/storedData";

const PARSE_SERVER_URL = import.meta.env.VITE_PARSE_SERVER_URL || "http://localhost:1337/parse";
const APP_ID = import.meta.env.VITE_PARSE_APP_ID || "parse_server_app";
const sessionToken = localStorage.getItem("sessionToken");
console.log("🚀 ~ sessionToken:", sessionToken) 

const UpdateProfile = () => {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const {setUser} = useAuth()

  const handleImageChange = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    try {

      const url = await uploadImage(file);

      setImageUrl(url);

    } catch (error) {

      console.log(error);

      alert("Image upload failed");

    }

  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    // console.log("🚀 ~ handleSubmit ~ profile:", profile)
    
    try {

      await axios.post(
        `${PARSE_SERVER_URL}/functions/updateProfile`,
        {
          name,
          phone,
          email,
          image: imageUrl
        },
        {
          headers: {
            "X-Parse-Application-Id": APP_ID,
            "X-Parse-Session-Token": sessionToken,
            "Content-Type": "application/json"
          }
        }
      );
      
      alert("Profile Updated");
      const profile = await getUserProfile()
      setUser(profile?.result)
      saveUser("user", profile?.result)
      
    } catch (error) {
      
      console.log(error);

      alert("Update failed");

    }

  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 1 }}>

      <Typography variant="h5" sx={{ textAlign: "center" }} mb={2}>
        Update Profile
      </Typography>

      <Typography sx={{ textAlign: "-webkit-center" }}>
        <Avatar component={"div"}
          src={imageUrl}
          sx={{ width: 100, height: 100, mb: 2, }}
        />
      </Typography>
      <Typography  padding={1} sx={{
        border:"1px solid grey",
        borderRadius:"8px"
      }}>
      <input type="file" onChange={handleImageChange} />
      </Typography>

      <form onSubmit={handleSubmit}>

        <TextField
          label="Name"
          size="small"
          fullWidth
          sx={{ mt: 2 }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Email"
          fullWidth
          size="small"
          sx={{ mt: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Phone"
          fullWidth
          size="small"
          sx={{ mt: 2 }}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 3 }}
          fullWidth
        >
          Update Profile
        </Button>

      </form>

    </Box>
  );
};

export default UpdateProfile;