import { Spinner } from "@heroui/react";

export default function Loader() {
  return (
    <div className="flex justify-center items-center p-8 w-full min-h-[50vh]">
      <Spinner size="lg" color="primary" label="" />
    </div>
  );
}
