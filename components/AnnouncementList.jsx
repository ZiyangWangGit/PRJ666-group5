// components/AnnouncementList.jsx
import { useState, useEffect, useCallback } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { getFirestore, collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { app } from "../lib/firebase";

const db = getFirestore(app);

export default function AnnouncementList({ courseId }) {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAnnouncements = useCallback(() => {
        const q = query(
            collection(db, "announcements"),
            where("courseId", "==", courseId),
            orderBy("postedAt", "desc")
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setAnnouncements(data);
            setLoading(false);
        }, error => {
            console.error("Error fetching announcements:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [courseId]);

    useEffect(() => {
        return fetchAnnouncements();
    }, [fetchAnnouncements]);

    if (loading) {
        return <p>Loading announcements...</p>;
    }

    return (
        <Card className="secondary-card my-3">
            <Card.Body>
                <h5>Announcement History</h5>
                {announcements.length > 0 ? (
                    <ListGroup>
                        {announcements.map(ann => (
                            <ListGroup.Item key={ann.id} className="highlight">
                                <p>{ann.content}</p>
                                <small>Posted by {ann.postedBy} on {new Date(ann.postedAt).toLocaleString()}</small>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                ) : (
                    <p>No announcements yet.</p>
                )}
            </Card.Body>
        </Card>
    );
}
