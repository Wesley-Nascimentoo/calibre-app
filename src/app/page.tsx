'use client'

import { useState } from "react"

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
import { Info } from "@/components/me/Info"

export default function Home() {

  const [showCard, showCardState] = useState<boolean>(true)

  return (
    <div className="flex justify-center items-center h-screen w-full flex-col gap-4">
      <Input type="text" placeholder="Pesquise o código do calibrador aqui" className="w-80 text-blue-500 font-bold" />
      <Card className="h-[400px] w-4xl border-2 border-blue-500">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">Calibradores cadastrados</CardTitle>
          <CardDescription className="text-center">Clique no código desejado para abrir seu card e ver suas inoformações</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="flex">
            <Button variant="default" className="m-1 bg-blue-500 text-white font-bold cursor-pointer">XXXXX-XX</Button>
          </ScrollArea>
        </CardContent>
      </Card>
      {
        showCard && (
          <div className="absolute bg-white h-screen inset-0 flex justify-center items-center">
            <Card className="border-2 border-blue-500 w-2xl flex-wrap">
              <CardHeader>
                <CardTitle>Infornações do equipamento</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-1 justify-between flex-wrap">
                <Info label="Código" value="XXXXX-XX" w="w-40" />
                <Info label="Modelo" value="VP-8131D" w="w-50" />
                <Info label="Status" value="Aprovado" w="w-62" />
                <Info label="Certificado" value="BYUIJ24" w="w-50" />
                <Info label="Nº de serie" value="XXXXX-XXXXX-XX" w="w-104" />
                <Info label="Descrição" value="Qualquer descrição" w="w-full" />
              </CardContent>
              <CardHeader>
                <CardTitle>Infornações da calibração do equipamento</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-1 justify-between flex-wrap">
                <Info label="Data" value="05/04/2025" w="w-38" />
                <Info label="Frquência" value="12 meses" w="w-42" />
                <Info label="Próxima calibração" value="Maio/2026" w="w-72" />
              </CardContent>
              <CardHeader>
                <CardTitle>Infornações da localização do equipamento</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-1 justify-between flex-wrap">
                <Info label="Data" value="05/04/2025" w="w-36" />
                <Info label="Área" value="QA - SALA DE MEDIÇÃO ELETRICA" w="w-76" />
                <Info label="Local" value="Produção" w="w-38" />
              </CardContent>
            </Card>
          </div>
        )
      }
    </div>
  );
}
