'use client'
import Image from "next/image";
import Content from "./component/content";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Content />
      </div>
    </QueryClientProvider>
  );
}
