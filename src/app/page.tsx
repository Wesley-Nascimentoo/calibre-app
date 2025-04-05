import { Input } from "@/components/ui/input"

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <Input type="text" placeholder="Pesquise o código do calibrador aqui" className="w-80 text-blue-800" />
    </div>
  );
}
