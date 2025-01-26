import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/router';

export default function Profile() {
  // URL for the profile image
  const profileImageUrl = "/images/User-Profile-PNG-Image.png"; // Corrected path
  const router = useRouter();
  const { id, name, email } = router.query;

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
      <h3>Name: {name}</h3>
      <h3>Email: {email}</h3>
      <h3>School ID: {id}</h3>
    </div>
  );
}
