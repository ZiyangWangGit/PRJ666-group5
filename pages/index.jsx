/*********************************************************************************
 *  WEB422 – Assignment 3
 *
 *  I declare that this assignment is my own work in accordance with Seneca's
 *  Academic Integrity Policy:
 *
 *  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 *  Name: Lian Karmiol          Student ID: 145154167       Date: 02/16/2024
 *
 ********************************************************************************/

import React from "react";
import { Inter } from "next/font/google";
import useSWR from "swr";
import { useState, useEffect } from "react";
import { Pagination, Accordion } from "react-bootstrap";
import ListingDetails from "@/components/ListingDetails.jsx";
import PageHeader from "@/components/PageHeader.jsx";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  let [page, setPage] = useState(1);
  let [pageData, setPageData] = useState([]);

  const { data, error } = useSWR(
    `https://a1-p3.onrender.com/api/listings?page=${page}&perPage=10`
  );

  console.log("consoled data",data);

  useEffect(() => {
    if (data) {
      setPageData(data);
    }
  }, [data]);

  const previous = () => {
    page > 1 && setPage(--page);
  };

  const next = () => {
    setPage(++page);
  };

  return (
    <>
      <PageHeader text="Browse Listings : Sorted by Number of Ratings" />

      <Accordion defaultActiveKey="0">
        {pageData.map((listing) => (
          <Accordion.Item eventKey={listing._id}>
            <Accordion.Header>
              <strong>{listing.name}</strong>&nbsp; {listing.address.street}
            </Accordion.Header>
              <Accordion.Body>
                <ListingDetails listing={listing} />
              </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
      <br />
      <Pagination>
        <Pagination.Prev onClick={previous} />
        <Pagination.Item>{page}</Pagination.Item>
        <Pagination.Next onClick={next} />
      </Pagination>
    </>
  );
}
