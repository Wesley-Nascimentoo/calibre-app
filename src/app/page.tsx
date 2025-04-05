import { Input } from "@/components/ui/input"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { ScrollArea } from "@/components/ui/scroll-area"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen w-full flex-col gap-4">
      <Input type="text" placeholder="Pesquise o código do calibrador aqui" className="w-80 text-blue-500" />
      <Card className="h-[400px] w-4xl border-2 border-blue-500">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">Calibradores cadastrados</CardTitle>
          <CardDescription className="text-center">Clique no código desejado para abrir seu card e ver suas inoformações</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="flex">
            <Button variant="default" className="m-1 bg-blue-500 text-white font-bold">XXXXX-XX</Button>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
