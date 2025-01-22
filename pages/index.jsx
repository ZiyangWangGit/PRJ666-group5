import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function Profile() {
  // URL for the profile image
  const profileImageUrl = "/images/User-Profile-PNG-Image.png"; // Corrected path

  return (
    <div>
      {/* Head component to set the page title */}
      <Head>
        <title>Profile</title>
      </Head>
      {/* Main heading for the profile page */}
      <h1>Profile Page</h1>
      <Image
        src={profileImageUrl}
        alt="Profile Image"
        width={150}
        height={150}
        style={{ borderRadius: "50%" }} // Rounded corners
      />
      {/* Static profile information */}
      <h3>Name</h3>
      <h3>Email</h3>
      <h3>Student ID</h3>
    </div>
  );
}
