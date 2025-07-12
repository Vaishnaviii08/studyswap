import React from "react";
import ProfileHeader from "../components/ProfileHeader";
import UploadedResources from "../components/UploadedResources";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { fullUser, fullUserLoading } = useAuth();

  if (fullUserLoading) return <div>Loading...</div>;
  if (!fullUser) return <div>You must be logged in to view this page.</div>;

  const formattedDate = new Date(fullUser.createdAt).toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <div>
      <div style={{backgroundColor: "#f9f9fb"}}>
        <ProfileHeader
          username={fullUser.username}
          email={fullUser.email}
          reputation={fullUser.reputationPoints}
          downloads={fullUser.downloadsCount}
          uploads={fullUser.uploadsCount}
          created={formattedDate}
        />
      </div>
      <div>
        <UploadedResources resources={fullUser.uploadedResources} username={fullUser.username} />
      </div>
    </div>
  );
};

export default Profile;
