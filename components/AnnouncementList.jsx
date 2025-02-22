import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

export default function AnnouncementList({ courseId }) {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "announcements"), where("courseId", "==", courseId), orderBy("postedAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAnnouncements(data);
    });

    return () => unsubscribe(); // Detach listener on unmount
  }, [courseId]);

  return (
    <div>
      {announcements.map(({ id, content, postedBy, postedAt }) => (
        <div key={id} style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
          <p>{content}</p>
          <small>Posted by {postedBy} at {new Date(postedAt.seconds * 1000).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}
