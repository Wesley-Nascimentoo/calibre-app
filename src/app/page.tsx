'use client'

import { ChangeEvent, useState } from "react"

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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faRightFromBracket, faSliders } from '@fortawesome/free-solid-svg-icons'
import { DropdownMenu, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel } from "@/components/ui/dropdown-menu"

export default function Home() {

  const [showCard, showCardState] = useState<boolean>(false)

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
            <Button
              variant="default"
              className="m-1 bg-blue-500 text-white font-bold cursor-pointer"
              onClick={(() => showCardState(true))}
            >
              XXXXX-XX
            </Button>
          </ScrollArea>
        </CardContent>
      </Card>
      {
        showCard && (
          <div className="absolute bg-white h-screen inset-0 flex flex-col justify-center items-center">
            <Card className="border-2 border-blue-500 w-2xl flex-wrap">
              <CardHeader className="flex flex-row justify-end h-4 w-full items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <FontAwesomeIcon icon={faSliders} width={30} className="text-xl cursor-pointer text-blue-500" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-white border-2 border-blue-500">
                    <DropdownMenuLabel>Opções</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem className="cursor-pointer">
                      Mudar localilzação
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <FontAwesomeIcon icon={faRightFromBracket} width={30} className="text-xl text-red-500 cursor-pointer" onClick={(() => {
                  showCardState(false)
                })} />
              </CardHeader>
              <CardHeader className="flex flex-row h-4 w-8/10 items-center">
                <FontAwesomeIcon icon={faCircleInfo} width={30} />
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
              <CardHeader className="flex flex-row h-4 w-8/10 items-center">
                <FontAwesomeIcon icon={faCircleInfo} width={30} />
                <CardTitle>Infornações da calibração do equipamento</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-1 justify-between flex-wrap">
                <Info label="Data" value="05/04/2025" w="w-38" />
                <Info label="Frquência" value="12 meses" w="w-42" />
                <Info label="Próxima calibração" value="Maio/2026" w="w-72" />
              </CardContent>
              <CardHeader className="flex flex-row h-4 w-8/10 items-center">
                <FontAwesomeIcon icon={faCircleInfo} width={30} />
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
