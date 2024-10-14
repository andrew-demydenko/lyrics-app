import { TailSpin } from "react-loader-spinner";

export default function Loader({ loading }: Readonly<{ loading: boolean }>) {
  return loading ? (
    <div className="absolute bg-[white] bg-opacity-75 z-20 inset-0 h-full w-full flex items-center justify-center">
      <TailSpin color="black" radius={"6px"} />
    </div>
  ) : null;
}
