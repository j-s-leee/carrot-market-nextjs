import Link from "next/link";

export default function TabBar() {
  return (
    <div>
      <Link href="/products">홈</Link>
      <Link href="/life">동네생활</Link>
      <Link href="/chat">채팅</Link>
      <Link href="/live">쇼핑</Link>
      <Link href="/profile">나의 당근</Link>
    </div>
  );
}
