import { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useUser } from '../context/UserContext';

export default function AnnouncementForm({ courseId }) {
  const [announcement, setAnnouncement] = useState('');
  const [file, setFile] = useState(null);
  const { user } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!announcement.trim()) return;

    const announcementData = {
      content: announcement,
      postedBy: user.email,
      courseId: courseId,
      postedAt: serverTimestamp(),
    };

    if (file) {
      // Handle file upload here, attach file URL to announcementData if needed
    }

    await addDoc(collection(db, "announcements"), announcementData);

    setAnnouncement('');
    setFile(null); // Clear the file input if used
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={announcement}
        onChange={(e) => setAnnouncement(e.target.value)}
        placeholder="Type your announcement here..."
      />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Post Announcement</button>
    </form>
  );
}
