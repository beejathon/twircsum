import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

import { api } from "~/utils/api";

export default function Home() {
  const { data } = api.channels.getAll.useQuery();
  const { data: user } = useSession();

  return (
    <>
      <div>
        {!user && <button onClick={() => signIn()}>Sign in</button>}
        {user && <button onClick={() => signOut()}>Sign out</button>}
      </div>
      {data?.map((channel) => (
        <div key={channel.id}>
          <Link href={`/channels/${channel.id}`}>{channel.name}</Link>
        </div>
      ))}
    </>
  );
}
