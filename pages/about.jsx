import Link from "next/link";
import Card from "react-bootstrap/Card";
import ListingDetails from "@/components/ListingDetails";
import PageHeader from "@/components/PageHeader";

// This function gets called at build time
export function getStaticProps() {
  // Call an external API endpoint to get posts
  return new Promise((resolve, reject) => {
    fetch("https://a1-p3.onrender.com/api/listings/660316")
      .then((res) => {
        console.log(res.json);
        return res.ok ? res.json() : Promise.reject(res.status);
      })
      .then((data) => {
        resolve({ props: { listing: data } });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export default function About(props) {
  return (
    <>
      <PageHeader text="About the Developer : Lian Karmiol" />
      <Card>
        <Card.Body>
          <p>
            I am a student at Seneca Polytechnic pursuing a Diploma in Computer
            Programming and Analysis. I see technology as not only a
            tool—rather, it is a mirror of our collective abilities and
            objectives. Its power to influence the future, open doors to
            countless opportunities, and advance mankind into a world of
            boundless possibility is what makes it so alluring. I am passionate
            aboupt gaining the knowledge to contribute to the power of
            technology on it&apos;s amazing journey of creation, development, and
            discovery.
            <br />
            <br />
            When I am not in front of the screen, I love to travel. You could
            find me everywhere from advenerous trips exploring new areas, to
            spending the day at a beach resort with a cocktail in my hand.
            <br />
            <br />I have always wanted to go to the &nbsp;
            <Link href="/listings/660316">&quot;Wonderful Waikiki Skytower&quot;</Link> 
            &nbsp; in Honolulu, Hawaii. Condominium (Airbnb).
          </p>
        </Card.Body>
        <ListingDetails listing={props.listing} />
      </Card>
    </>
  )
}
