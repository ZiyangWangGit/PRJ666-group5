import Head from "next/head";
import { useRouter } from "next/router";

export default function Course2() {
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>Course 2</title>
      </Head>
      <h1>Course 2</h1>
      <button onClick={() => router.back()}>Back</button>
    </div>
  );
}
