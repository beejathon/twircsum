import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";

export default function Home() {
  const { data } = api.channels.getAll.useQuery();

  return (
    <>{data?.map((channel) => <div key={channel.id}>{channel.name}</div>)}</>
  );
}
