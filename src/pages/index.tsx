import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: user } = useSession();

  return (
    <>
      <h1>Home</h1>
      <div>
        {!user && <button onClick={() => signIn()}>Sign in</button>}
        {user && <button onClick={() => signOut()}>Sign out</button>}
      </div>
      <Link href="/channels">Channel List</Link>
    </>
  );
}
