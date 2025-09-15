import { Input } from "./input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

export default function DocDetails() {

    return <>
        <div className="flex flex-col gap-4 mb-6">
            <Input placeholder="Invoice No" />
            <Input placeholder="Purchase Order No" />
            <Input placeholder="Part No" />
            <Input placeholder="Part Name" />
            <Select>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Document Type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="light">MTC</SelectItem>
                <SelectItem value="dark">PTC</SelectItem>
                <SelectItem value="system">PDI</SelectItem>
                <SelectItem value="system">Other</SelectItem>
            </SelectContent>
            </Select>
        </div>
    </>
}