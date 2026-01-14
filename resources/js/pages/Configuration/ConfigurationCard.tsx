import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Link } from '@inertiajs/react';

interface Option {
    name: string;
    status: boolean;
    type?: string;
    href?: string;
}

interface Props {
    title: string;
    options: Option[];
    onToggle: (optionIndex: number) => void;
}

export default function ConfigurationCard({ title, options, onToggle }: Props) {
    return (
        <Card className="h-full border-t-4 border-t-emerald-500 shadow-sm hover:shadow-md transition-shadow bg-card">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    {options.map((option, index) => (
                        <li key={index} className="flex items-center justify-between gap-2">
                            {option.type === 'route' ? (
                                <Link
                                    href={option.href || '#'}
                                    className="text-sm cursor-pointer text-foreground hover:text-emerald-500 hover:underline"
                                >
                                    {option.name}
                                </Link>
                            ) : (
                                <Label
                                    htmlFor={`${title}-${index}`}
                                    className={`text-sm cursor-pointer ${!option.status ? 'text-muted-foreground' : 'text-foreground'}`}
                                >
                                    {option.name}
                                </Label>
                            )}

                            {option.type === 'toggle' && (
                                <Switch
                                    id={`${title}-${index}`}
                                    checked={option.status}
                                    onCheckedChange={() => onToggle(index)}
                                    className="data-[state=checked]:bg-emerald-500"
                                />
                            )}
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
