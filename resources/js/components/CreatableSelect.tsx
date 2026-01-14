import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList, // Import CommandList
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export interface Option {
    id: number | string;
    name: string;
}

interface CreatableSelectProps {
    options: Option[];
    value?: number | string;
    onChange: (value: Option) => void;
    onCreate: (name: string) => Promise<Option | void>; // Returns the new option
    placeholder?: string;
}

export function CreatableSelect({ options, value, onChange, onCreate, placeholder = "Seleccionar..." }: CreatableSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [searchValue, setSearchValue] = React.useState("")

    // Find selected option object
    const selectedOption = options.find(opt => opt.id.toString() === value?.toString())

    const handleCreate = async () => {
        if (!searchValue) return;
        const newOpt = await onCreate(searchValue);
        if (newOpt) {
            onChange(newOpt);
            setOpen(false);
            setSearchValue("");
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between font-normal"
                >
                    {selectedOption ? selectedOption.name : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput
                        placeholder="Buscar..."
                        value={searchValue}
                        onValueChange={setSearchValue}
                    />
                    {/* Wrap Items in CommandList to avoid error */}
                    <CommandList>
                        <CommandEmpty>
                            <div className="p-2 text-sm text-center">
                                <p className="text-muted-foreground mb-2">No encontrado.</p>
                                {searchValue && (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={handleCreate}
                                        className="w-full"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Crear "{searchValue}"
                                    </Button>
                                )}
                            </div>
                        </CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.id}
                                    value={option.name} // Command uses name/label for filtering by default
                                    onSelect={() => {
                                        onChange(option)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value?.toString() === option.id.toString() ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
