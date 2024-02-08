import { useRouter } from "next/router";
import useSWR from "swr";
import ListingDetails from "@/components/ListingDetails.jsx";
import Error from "next/error";
import PageHeader from "@/components/PageHeader.jsx";

export default function Ids() {
  console.log("ID JSX");
  const router = useRouter();
  const { id } = router.query;

  const { data, error, isLoading } = useSWR(
    `https://a1-p3.onrender.com/api/listings/${id}`
  );

  if (isLoading) {
    return null;
  }
  if (error) {
    return <Error statusCode={404} />;
  }

  return (
    <>
      <PageHeader text={listing.name} />
      <ListingDetails listing={<ListingDetails listing={listing} />} />
    </>
  );
}
