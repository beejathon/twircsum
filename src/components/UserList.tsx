import { type User } from "@prisma/client";

type UserListProps = {
  users: User[];
};

export const UserList = (props: UserListProps) => {
  if (!props.users.length) {
    return <div>Loading...</div>;
  }

  return (
    <div id="userlist">
      {props.users?.map((user) => <div key={user.id}>{user.name}</div>)}
    </div>
  );
};
