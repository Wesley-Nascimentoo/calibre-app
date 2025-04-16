'use client'

import { ChangeEvent, useEffect, useState } from "react"

import { Input } from "@/components/ui/input"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { cn } from "@/lib/utils"

import { format, addMonths, parse } from "date-fns"

import { ptBR } from "date-fns/locale"

import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

import { ScrollArea } from "@/components/ui/scroll-area"

import { Button } from "@/components/ui/button"
import { Info } from "@/components/me/Info"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faCircleInfo, faLeftLong, faPlusCircle, faRightFromBracket, faRightLong, faSliders } from '@fortawesome/free-solid-svg-icons'
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel } from "@/components/ui/dropdown-menu"

import axios from 'axios'
import InputWithLabel from "@/components/me/input-with-label"

import { Textarea } from "@/components/ui/textarea"

import QRCode from 'react-qr-code';
import { useParams } from "next/navigation"


interface CalibrationData {
    id: number;
    calibratorCode: string;
    date: string; // ou Date, se for convertido
    frequency: string;
    next: string; // ou Date
    toleranceProcess: string
}

interface LocationData {
    id: number;
    calibratorCode: string;
    entryDate: string; // ou Date
    leaveDate: string; // ou Date
    location: string;
    department: string;
    observation: string;
}

interface Calibrator {
    id: number;
    code: string;
    model: string;
    status: string;
    certificate: string;
    serialNumber: string;
    description: string;
    observation: string;
    calibrationDataId: number;
    locationDataId: number;
    calibrationData: CalibrationData;
    locationData: LocationData;
}

const mockCalibrator: Calibrator = {
    id: 1,
    code: "",
    model: "",
    status: "ativo",
    certificate: "Certificado XYZ",
    serialNumber: "SN123456",
    description: "Calibrador de pressão",
    observation: "Observação aqui",
    calibrationDataId: 1,
    locationDataId: 1,
    calibrationData: {
        id: 1,
        calibratorCode: "CAL-001",
        date: "2025-04-05T00:00:00.000Z",
        frequency: "Anual",
        next: "2026-01-01T03:00:00.000Z",
        toleranceProcess: "dsd"
    },
    locationData: {
        id: 1,
        calibratorCode: "CAL-001",
        entryDate: "2025-04-01T00:00:00.000Z",
        leaveDate: "2025-04-30T00:00:00.000Z",
        location: "Laboratório A",
        department: "Engenharia",
        observation: "Uso interno"
    }
};

export default function Home() {

    const [showCard, showCardState] = useState<boolean>(false)

    const [calibrators, setCalibrators] = useState<Calibrator[]>()

    const [calibratorWithFilter, setCalibratorWithFilter] = useState<Calibrator[]>(calibrators as Calibrator[])

    const [selected, setSelected] = useState<Calibrator>(mockCalibrator)

    const [changeLocation, setChangeLocation] = useState<boolean>(false)
    const [changeCalibratorInfos, setChangeCalibratorInfos] = useState<boolean>(false)
    const [changeCalibrationInfos, setChangeCalibrationInfos] = useState<boolean>(false)

    const [newDepartment, setNewDepartment] = useState<string>('')
    const [newLocation, setNewLocation] = useState<string>('')
    const [observation, setObservation] = useState<string>('')

    const [historicLocation, setHistoricLocation] = useState<LocationData[]>([])

    const [currentLocationHistoricIndex, setCurrentLocationHistoricIndex] = useState<number>(0)

    // para edição de informaçõe do equipamento
    const [newCode, setNewCode] = useState<string>('')
    const [newModel, setNewModel] = useState<string>('')
    const [newStatus, setNewStatus] = useState<string>('')
    const [newCertificate, setNewCertificate] = useState<string>('')
    const [newSerialNumber, setNewSerialNumber] = useState<string>('')
    const [newDescription, setNewDescription] = useState<string>('')
    const [newObservation, setNewObservation] = useState<string>('')

    //para editar informações de calibração
    const [date, setDate] = useState<Date | string>()
    const [newFrenquecy, setNewFrequency] = useState<string>(selected.calibrationData.frequency)
    const [nextCalibration, setNextCalibration] = useState<string>(selected.calibrationData.next)
    const [toleranceProcess, setToleranceProcess] = useState<string>(selected.calibrationData.toleranceProcess)


    //para criar cadastrar um novo calibrador
    const [registerNewCalibrator, setRegisterNewCalibrator] = useState<boolean>(false)

    const [newCalibratorCode, setNewCalibratorCode] = useState<string>('')         // Código
    const [newCalibratorModel, setNewCalibratorModel] = useState<string>('')       // Modelo
    const [newCalibratorStatus, setNewCalibratorStatus] = useState<string>('')     // Status
    const [newCalibratorCertificate, setNewCalibratorCertificate] = useState<string>('') // Certificado
    const [newCalibratorSerialNumber, setNewCalibratorSerialNumber] = useState<string>('') // Nº de série
    const [newCalibratorDescription, setNewCalibratorDescription] = useState<string>('')   // Descrição
    const [newCalibratorObservation, setNewCalibratorObservation] = useState<string>('')   // Observação

    const [calibrationDate, setCalibrationDate] = useState<Date | string>('')       // Data da calibração
    const [newCalibrationFrequency, setNewCalibrationFrequency] = useState<string>('')                    // Frequência (meses)
    const [newCalibrationNextCalibration, setNewCalibrationNextCalibration] = useState<string>('')              // Próxima calibração (MM/yyyy)
    const [newProcessTolerance, setNewProcessTolerance] = useState<string>('')

    const [area, setArea] = useState<string>('')
    const [location, setLocation] = useState<string>('')
    const [locationObservation, setLocationObservation] = useState<string>('')

    useEffect(() => {
        axios.get('http://l0.12.100.156:5002/calibrator').then(response => {
            setCalibrators(response.data)
            setCalibratorWithFilter(response.data)
        })
    }, [showCard, registerNewCalibrator])

    const changeLocationApi = () => {
        axios.put('http://10.12.100.156:5002/location', {
            calibratorId: selected.code,
            newDepartment,
            newLocation,
            observation,
            currentLocationId: historicLocation[historicLocation.length - 1].id
        }).then(async (response) => {
            toast.success('Localização do calibrador atualizada com sucesso!')
            await getHistoric(selected.code)
            setChangeLocation(false)
            showCardState(false)
            showCardState(true)
        }).catch((error) => toast.error("Erro ao atualizar informações"))
    }

    const updateCalibratorInfos = () => {
        axios.put('http://10.12.100.156:5002/calibrator', {
            code: selected.code,
            newCode,
            newModel,
            newStatus,
            newCertificate,
            newSerialNumber,
            newDescription,
            newObservation
        }).then(async (response) => {
            toast.success('Informações do calibrador atualizadas com sucesso!')
            await setSelected(response.data)
            console.log(response.data)
            setChangeCalibratorInfos(false)
        }).catch((error) => toast.error("Erro ao atualizar informações"))
    }

    const updateCalibrationInfos = () => {
        axios.put('http://10.12.100.156:5002/calibration', {
            calibratorCode: selected.code,
            date: date,
            newFrequency: newFrenquecy,
            nextCalibration,
            toleranceProcess,
            calibrationDataId: selected.calibrationDataId
        }).then(async (response) => {
            toast.success('Informações da calibração atualizadas com sucesso!')
            await setSelected(response.data)
            console.log(response.data)
            setChangeCalibrationInfos(false)
        }).catch((error) => toast.error("Erro ao atualizar informações"))
    }


    const getHistoric = async (id: string) => {
        axios.get('http://10.12.100.156:5002/location', {
            params: {
                code: id
            }
        }).then(response => {
            setHistoricLocation(response.data.locations)
            setCurrentLocationHistoricIndex(response.data.locations.length - 1)
        })
    }

    const params = useParams()
    const code = params.code as string


    useEffect(() => {
        if (code && calibrators?.length) {
            const found = calibrators.find(cal => cal.code === code)
            if (found) {
                setSelected(found)
                showCardState(true)
                getHistoric(code)
            }
        }
    }, [code, calibrators])

    const handleRegisterNewCalibrator = () => {
        axios.post('http://10.12.100.156:5002/calibrator', {
            code: newCalibratorCode,
            model: newCalibratorModel,
            status: newCalibratorStatus,
            certificate: newCalibratorCertificate,
            serialNumber: newCalibratorSerialNumber,
            description: newCalibratorDescription,
            observation: newCalibratorObservation,
            calibrationData: {
                date: format(calibrationDate, 'dd/MM/yyyy'),
                frequency: newCalibrationFrequency,
                next: newCalibrationNextCalibration,
                toleranceProcess: newProcessTolerance
            },
            locationData: {
                entryDate: format(new Date().toLocaleDateString('pt-br'), 'dd/MM/yyyy'),
                leaveDate: 'hoje',
                location: location,
                department: area,
                observation: locationObservation
            }
        }).then(
            response => {
                toast.success('Calibrador registrado com sucesso!')
                setRegisterNewCalibrator(false)

            }
        ).catch((error) => toast.error("Erro ao cadastrar calibrador"))
    }

    const [generateLabel, setGenerateLabel] = useState<boolean>(false)


    return (
        <div className="flex justify-center items-center h-screen w-full flex-col gap-4">
            <Toaster position="top-right" className="bg-blue-600" />
            <div className="flex items-center gap-2">
                <Input
                    type="text"
                    placeholder="Pesquise o código do calibrador aqui"
                    className="w-80 text-blue-500 font-bold"
                    onChange={(ev: ChangeEvent<HTMLInputElement>) => {
                        const valor = ev.target.value.toLowerCase();

                        if (valor === '') {
                            // Se estiver vazio, volta para a lista original
                            setCalibratorWithFilter(calibrators as Calibrator[]);
                        } else {
                            // Filtra com base na lista original
                            setCalibratorWithFilter(
                                (calibrators as Calibrator[]).filter((item) =>
                                    item.code.toLowerCase().includes(valor)
                                )
                            );
                        }
                    }}
                />
                <FontAwesomeIcon
                    icon={faPlusCircle}
                    className="cursor-pointer text-blue-500 text-2xl"
                    onClick={() => setRegisterNewCalibrator(true)}
                />
            </div>
            <Card className="h-[400px] w-4xl border-2 border-blue-500">
                <CardHeader>
                    <CardTitle className="text-center text-xl font-bold">Calibradores cadastrados</CardTitle>
                    <CardDescription className="text-center">Clique no código desejado para abrir seu card e ver suas inoformações</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="flex">
                        {
                            calibratorWithFilter?.map((calibrator, i) => (
                                <Button
                                    key={i}
                                    variant="default"
                                    className="m-1 bg-blue-500 text-white font-bold cursor-pointer"
                                    onClick={(async () => {
                                        await setSelected(calibrator)
                                        showCardState(true)
                                        await getHistoric(calibrator.code)
                                    })}
                                >
                                    {calibrator.code}
                                </Button>
                            ))
                        }
                    </ScrollArea>
                </CardContent>
            </Card>
            {
                showCard && (
                    <div className="absolute bg-white h-screen inset-0 flex flex-col justify-center items-center">
                        <Card className="border-2 border-blue-500 w-2xl flex-wrap">
                            <CardHeader className="flex flex-row justify-between h-4 w-full items-center mb-2">
                                <QRCode value={`http://10.12.100.156:3000/${selected.code}`} className="w-10 h-10" />
                                <div className="flex">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <FontAwesomeIcon icon={faSliders} width={30} className="text-xl cursor-pointer text-blue-500" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56 bg-white border-2 border-blue-500">
                                            <DropdownMenuLabel>Opções</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuCheckboxItem
                                                className="cursor-pointer"
                                                checked={changeLocation}
                                                onCheckedChange={setChangeLocation}
                                            >
                                                Mudar localilzação
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem
                                                className="cursor-pointer"
                                                checked={changeCalibratorInfos}
                                                onCheckedChange={setChangeCalibratorInfos}
                                                onClick={(() => {
                                                    setNewCode(selected.code)
                                                    setNewModel(selected.model)
                                                    setNewStatus(selected.status)
                                                    setNewCertificate(selected.certificate)
                                                    setNewSerialNumber(selected.serialNumber)
                                                    setNewDescription(selected.description)
                                                    setNewObservation(selected.observation)
                                                })}
                                            >
                                                Editar informações do equipamento
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem
                                                className="cursor-pointer"
                                                checked={changeCalibrationInfos}
                                                onCheckedChange={setChangeCalibrationInfos}
                                                onClick={() => {
                                                    setDate(selected.calibrationData.date)
                                                    setNewFrequency(selected.calibrationData.frequency)
                                                    setNextCalibration(selected.calibrationData.next)
                                                    setToleranceProcess(selected.calibrationData.toleranceProcess)
                                                }}
                                            >
                                                Editar informações de calibração
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    setGenerateLabel(true)
                                                }}
                                            >
                                                Gerar etiqueta para impressão
                                            </DropdownMenuCheckboxItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <FontAwesomeIcon icon={faRightFromBracket} width={30} className="text-xl text-red-500 cursor-pointer" onClick={(() => {
                                        showCardState(false)
                                    })} />
                                </div>
                            </CardHeader>
                            <CardHeader className="flex flex-row h-4  items-center">
                                <FontAwesomeIcon icon={faCircleInfo} width={30} />
                                <CardTitle>Informações do equipamento</CardTitle>
                            </CardHeader>
                            <CardContent className="flex gap-1 justify-between flex-wrap">
                                <Info label="Código" value={selected?.code} w="w-40" />
                                <Info label="Modelo" value={selected?.model} w="w-50" />
                                <Info label="Status" value={selected?.status} w="w-62" />
                                <Info label="Certificado" value={selected?.certificate} w="w-50" />
                                <Info label="Nº de serie" value={selected?.serialNumber} w="w-104" />
                                <Info label="Descrição" value={selected?.description} w="w-full" />
                                <Info label="Observação" value={selected?.observation} w="w-full" />
                            </CardContent>
                            <CardHeader className="flex flex-row h-4 w-8/10 items-center">
                                <FontAwesomeIcon icon={faCircleInfo} width={30} />
                                <CardTitle>Informações da calibração do equipamento</CardTitle>
                            </CardHeader>
                            <CardContent className="flex gap-1 justify-between flex-wrap">
                                <Info label="Data" value={selected?.calibrationData?.date} w="w-38" />
                                <Info label="Frequência (meses)" value={selected?.calibrationData?.frequency} w="w-54" />
                                <Info label="Próxima calibração" value={selected?.calibrationData?.next} w="w-60" />
                                <Info label="Tolerância do processo" value={selected?.calibrationData?.toleranceProcess} w="w-full" />
                            </CardContent>
                            <CardHeader className="flex flex-row h-4 w-8/10 items-center">
                                <FontAwesomeIcon icon={faCircleInfo} width={30} />
                                <CardTitle>Informações da localização do equipamento</CardTitle>
                            </CardHeader>
                            <CardContent className="flex gap-1 justify-between flex-wrap">
                                <div className={`flex gap-1 rounded-md bg-blue-100 p-1 w-full font-semibold text-center`}>
                                    <p
                                        className="bold text-center w-full"
                                    >
                                        {`${historicLocation[currentLocationHistoricIndex]?.location}, 
                    ${historicLocation[currentLocationHistoricIndex]?.department}  | De: 
                    ${historicLocation[currentLocationHistoricIndex]?.entryDate} até 
                    ${historicLocation[currentLocationHistoricIndex]?.leaveDate} `}

                                    </p>
                                </div>
                                <Info label="Observação" value={historicLocation[currentLocationHistoricIndex]?.observation} w="w-full" />
                                <div className="flex w-full justify-between">
                                    <FontAwesomeIcon
                                        icon={faLeftLong}
                                        className="text-2xl text-blue-500 cursor-pointer"
                                        onClick={() => {
                                            if (currentLocationHistoricIndex > 0) {
                                                setCurrentLocationHistoricIndex(prev => prev - 1)
                                            } else {
                                                toast.info('Você já está na localização mais antiga!')
                                            }
                                        }}
                                    />
                                    <FontAwesomeIcon
                                        icon={faRightLong}
                                        className="text-2xl text-blue-500 cursor-pointer"
                                        onClick={() => {
                                            if (currentLocationHistoricIndex < historicLocation.length - 1) {
                                                setCurrentLocationHistoricIndex(prev => prev + 1)
                                            } else {
                                                toast.info('Você já está na localização mais recente!')
                                            }
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                        {
                            changeLocation && (
                                <div className="absolute bg-white h-screen inset-0 flex flex-col justify-center items-center">
                                    <Card className="w-90 h-110 border-blue-500">
                                        <div className="flex w-85 justify-end">
                                            <FontAwesomeIcon
                                                icon={faRightFromBracket}
                                                className="text-red-500 text-xl cursor-pointer"
                                                onClick={(() => setChangeLocation(false))}
                                            />
                                        </div>
                                        <CardHeader>
                                            <CardTitle>Mudança de local</CardTitle>
                                            <CardDescription>Defina o local para aonde vai o equipamento</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex flex-col gap-3">
                                            <InputWithLabel
                                                label="Área"
                                                placeholder="Defina a nova área aqui"
                                                value={newDepartment}
                                                setValue={setNewDepartment}
                                            />
                                            <InputWithLabel
                                                label="Local"
                                                placeholder="Defina o novo local aqui"
                                                value={newLocation}
                                                setValue={setNewLocation}
                                            />
                                            <div className="flex flex-col">
                                                <label className="text-sm font-semibold">Observação</label>
                                                <Textarea
                                                    placeholder="Se tiver alguma observação digite aqui"
                                                    className="font-semibold"
                                                    value={observation}
                                                    onChange={((ev: ChangeEvent<HTMLTextAreaElement>) => setObservation(ev.target.value))}
                                                />
                                            </div>
                                            <div className="flex justify-end">
                                                <Button
                                                    variant={"default"}
                                                    className="cursor-pointer bg-blue-500  w-2/10 text-white"
                                                    onClick={async () => {
                                                        changeLocationApi()
                                                    }}
                                                >
                                                    Mudar
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )
                        }
                        {
                            changeCalibratorInfos && (
                                <div className="absolute bg-white h-screen inset-0 flex flex-col justify-center items-center">
                                    <Card className="w-90">
                                        <div className="flex w-85 justify-end">
                                            <FontAwesomeIcon
                                                icon={faRightFromBracket}
                                                className="text-red-500 text-xl cursor-pointer"
                                                onClick={(() => setChangeCalibratorInfos(false))}
                                            />
                                        </div>
                                        <CardHeader>
                                            <CardTitle>Edição de informações do calibrador {selected.code}</CardTitle>
                                            <CardDescription>Edite as informações do calibrador aqui</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex flex-col gap-2">
                                            <InputWithLabel
                                                label="Código"
                                                placeholder="Digite o novo código aqui"
                                                value={newCode}
                                                setValue={setNewCode}
                                            />
                                            <InputWithLabel
                                                label="Modelo"
                                                placeholder="Digite o novo modelo aqui"
                                                value={newModel}
                                                setValue={setNewModel}
                                            />
                                            <InputWithLabel
                                                label="Status"
                                                placeholder="Digite o novo status aqui"
                                                value={newStatus}
                                                setValue={setNewStatus}
                                            />
                                            <InputWithLabel
                                                label="Certificado"
                                                placeholder="Digite o novo certificado aqui"
                                                value={newCertificate}
                                                setValue={setNewCertificate}
                                            />
                                            <InputWithLabel
                                                label="N° de série"
                                                placeholder="Digite o novo número de série aqui"
                                                value={newSerialNumber}
                                                setValue={setNewSerialNumber}
                                            />
                                            <div className="flex flex-col">
                                                <label className="text-sm font-semibold">Descrição</label>
                                                <Textarea
                                                    placeholder="Digite a nova descrição aqui"
                                                    className="font-semibold"
                                                    value={newDescription}
                                                    onChange={((ev: ChangeEvent<HTMLTextAreaElement>) => setNewDescription(ev.target.value))}
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-sm font-semibold">Observação</label>
                                                <Textarea
                                                    placeholder="Se tiver alguma observação digite aqui"
                                                    className="font-semibold"
                                                    value={newObservation}
                                                    onChange={((ev: ChangeEvent<HTMLTextAreaElement>) => setNewObservation(ev.target.value))}
                                                />
                                            </div>
                                            <div className="flex justify-end">
                                                <Button
                                                    variant={"default"}
                                                    className="cursor-pointer bg-blue-500  w-28 text-white"
                                                    onClick={async () => {
                                                        updateCalibratorInfos()
                                                    }}
                                                >
                                                    Salvar alterações
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                            )
                        }
                    </div>
                )
            }
            {
                changeCalibrationInfos && (
                    <div className="absolute bg-white h-screen inset-0 flex flex-col justify-center items-center">
                        <Card className="w-90">
                            <div className="flex w-85 justify-end">
                                <FontAwesomeIcon
                                    icon={faRightFromBracket}
                                    className="text-red-500 text-xl cursor-pointer"
                                    onClick={(() => setChangeCalibrationInfos(false))}
                                />
                            </div>
                            <CardHeader>
                                <CardTitle>{selected.code}</CardTitle>
                                <CardDescription>Edite as informações de calibração aqui</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-semibold">Data da calibração</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal cursor-pointer",
                                                )}
                                            >
                                                <FontAwesomeIcon icon={faCalendar} />
                                                {date
                                                    ? format(date instanceof Date ? date : parse(date, 'dd/MM/yyyy', new Date()), 'dd/MM/yyyy')
                                                    : 'Selecione uma data'}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={date as Date}
                                                onSelect={(ev) => {
                                                    setDate(ev)

                                                    if (ev instanceof Date && !isNaN(ev.getTime())) {
                                                        setNextCalibration(format(addMonths(ev, Number(newFrenquecy)), 'MM/yyyy'))
                                                    }
                                                }}
                                                initialFocus
                                                locale={ptBR}
                                                className="bg-blue-100 cursor-pointer"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="font-semibold text-sm">{"Frequência (meses)"}</label>
                                    <Input
                                        type="text"
                                        placeholder={"Digite aqui a nova frequência"}
                                        className="font-semibold"
                                        value={newFrenquecy}
                                        onChange={(ev: ChangeEvent<HTMLInputElement>) => {
                                            setNewFrequency(ev.target.value)
                                            setNextCalibration(format(addMonths(parse(date as string, 'dd/MM/yyyy', new Date()), Number(ev.target.value)), 'MM/yyyy'))
                                        }}
                                    />
                                </div>
                                <InputWithLabel
                                    label="Próxima calibração"
                                    placeholder="Digite aqui a nova data de calibração"
                                    value={nextCalibration}
                                    setValue={setNextCalibration}
                                />
                                <InputWithLabel
                                    label="Tolerância do processo"
                                    placeholder="Digite aqui a nova tolerância do processo"
                                    value={toleranceProcess}
                                    setValue={setToleranceProcess}
                                />
                                <div className="flex justify-end">
                                    <Button
                                        variant={"default"}
                                        className="cursor-pointer bg-blue-500  w-28 text-white"
                                        onClick={async () => {
                                            updateCalibrationInfos()
                                        }}
                                    >
                                        Salvar alterações
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                )
            }
            {
                registerNewCalibrator && (
                    <div className="absolute bg-white h-screen inset-0 flex flex-col justify-center items-center">
                        <Card className="w-170">
                            <div className="flex w-165 justify-end">
                                <FontAwesomeIcon
                                    icon={faRightFromBracket}
                                    className="text-red-500 text-xl cursor-pointer"
                                    onClick={(() => setRegisterNewCalibrator(false))}
                                />
                            </div>
                            <CardHeader>
                                <CardTitle>Forneça as informações do calibrador</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-2 w-full">
                                <InputWithLabel
                                    label="Código"
                                    placeholder="Digite o novo código aqui"
                                    value={newCalibratorCode}
                                    setValue={setNewCalibratorCode}
                                    w="w-50"
                                />
                                <InputWithLabel
                                    label="Modelo"
                                    placeholder="Digite o novo modelo aqui"
                                    value={newCalibratorModel}
                                    setValue={setNewCalibratorModel}
                                    w="w-53"
                                />
                                <InputWithLabel
                                    label="Status"
                                    placeholder="Digite o novo status aqui"
                                    value={newCalibratorStatus}
                                    setValue={setNewCalibratorStatus}
                                    w='w-50'
                                />
                                <InputWithLabel
                                    label="Certificado"
                                    placeholder="Digite o novo certificado aqui"
                                    value={newCalibratorCertificate}
                                    setValue={setNewCalibratorCertificate}
                                    w="w-80"
                                />
                                <InputWithLabel
                                    label="N° de série"
                                    placeholder="Digite o novo número de série aqui"
                                    value={newCalibratorSerialNumber}
                                    setValue={setNewCalibratorSerialNumber}
                                    w="w-75"
                                />
                                <div className="flex flex-col w-full">
                                    <label className="text-sm font-semibold">Descrição</label>
                                    <Textarea
                                        placeholder="Digite a nova descrição aqui"
                                        className="font-semibold"
                                        value={newCalibratorDescription}
                                        onChange={((ev: ChangeEvent<HTMLTextAreaElement>) => setNewCalibratorDescription(ev.target.value))}
                                    />
                                </div>
                                <div className="flex flex-col w-full">
                                    <label className="text-sm font-semibold">Observação</label>
                                    <Textarea
                                        placeholder="Se tiver alguma observação digite aqui"
                                        className="font-semibold"
                                        value={newCalibratorObservation}
                                        onChange={((ev: ChangeEvent<HTMLTextAreaElement>) => setNewCalibratorObservation(ev.target.value))}
                                    />
                                </div>
                            </CardContent>
                            <CardHeader>
                                <CardTitle>Forneça as informações de calibração</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-2 w-full justify-between">
                                <div className="flex flex-col gap-1 w-50">
                                    <label className="text-sm font-semibold">Data da calibração</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal cursor-pointer",
                                                )}
                                            >
                                                <FontAwesomeIcon icon={faCalendar} />
                                                {calibrationDate
                                                    ? format(calibrationDate instanceof Date ? calibrationDate : parse(calibrationDate, 'dd/MM/yyyy', new Date()), 'dd/MM/yyyy')
                                                    : 'Selecione uma data'}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={date as Date}
                                                onSelect={(ev) => {
                                                    setCalibrationDate(ev as Date)

                                                    if (ev instanceof Date && !isNaN(ev.getTime())) {
                                                        setNewCalibrationNextCalibration(format(addMonths(ev, Number(newCalibrationFrequency)), 'MM/yyyy'))
                                                    }
                                                }}
                                                initialFocus
                                                locale={ptBR}
                                                className="bg-blue-100 cursor-pointer"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="font-semibold text-sm">{"Frequência (meses)"}</label>
                                    <Input
                                        type="text"
                                        placeholder={"Digite aqui a nova frequência"}
                                        className="font-semibold"
                                        value={newCalibrationFrequency}
                                        onChange={(ev: ChangeEvent<HTMLInputElement>) => {
                                            setNewCalibrationFrequency(ev.target.value)
                                            setNewCalibrationNextCalibration(format(addMonths(calibrationDate, Number(ev.target.value)), 'MM/yyyy'))
                                        }}
                                    />
                                </div>
                                <InputWithLabel
                                    label="Próxima calibração"
                                    placeholder="Digite aqui a nova data de calibração"
                                    value={newCalibrationNextCalibration}
                                    setValue={setNewCalibrationNextCalibration}
                                />
                                <InputWithLabel
                                    label="Tolerância do processo"
                                    placeholder="Digite aqui a nova tolerância do processo"
                                    value={newProcessTolerance}
                                    setValue={setNewProcessTolerance}
                                    w="w-full"
                                />
                            </CardContent>
                            <CardHeader>
                                <CardTitle>Forneça as informações de localização</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-3 w-full justify-between">
                                <InputWithLabel
                                    label="Área"
                                    placeholder="Defina a nova área aqui"
                                    value={area}
                                    setValue={setArea}
                                    w="w-70"
                                />
                                <InputWithLabel
                                    label="Local"
                                    placeholder="Defina o novo local aqui"
                                    value={location}
                                    setValue={setLocation}
                                    w="w-80"
                                />
                                <div className="flex flex-col w-full">
                                    <label className="text-sm font-semibold">Observação</label>
                                    <Textarea
                                        placeholder="Se tiver alguma observação digite aqui"
                                        className="font-semibold"
                                        value={locationObservation}
                                        onChange={((ev: ChangeEvent<HTMLTextAreaElement>) => setLocationObservation(ev.target.value))}
                                    />
                                </div>
                                <div className="flex w-full justify-end">
                                    <Button
                                        variant={"default"}
                                        className="cursor-pointer bg-blue-500 text-white"
                                        onClick={async () => {
                                            handleRegisterNewCalibrator()
                                        }}
                                    >
                                        Registrar novo calibrador
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )
            }
            {
                generateLabel && (
                    <div className="absolute bg-white h-screen inset-0 flex flex-col justify-center items-center">
                        <FontAwesomeIcon
                            icon={faRightFromBracket}
                            className="text-red-500 text-xl cursor-pointer fixed top-5 right-5"
                            onClick={(() => setGenerateLabel(false))}
                        />
                        <div className="flex flex-col items-center border-2 p-2 rounded-md">
                            <QRCode value={`http://10.12.100.156:3000/${selected.code}`} className="w-36 h-36" />
                            <p>{selected.code}</p>
                        </div>
                    </div>
                )
            }
        </div>
    );
}
