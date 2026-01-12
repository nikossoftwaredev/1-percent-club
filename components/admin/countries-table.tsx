"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Country {
  id: string;
  name: string;
  code: string;
  flagEmoji: string;
}

type DialogMode = "create" | "edit" | "delete" | null;

interface CountryFormData {
  name: string;
  code: string;
  flagEmoji: string;
}

const initialFormData: CountryFormData = { name: "", code: "", flagEmoji: "" };

// Mock data - replace with actual data fetching
const initialCountries: Country[] = [
  { id: "1", name: "United States", code: "US", flagEmoji: "🇺🇸" },
  { id: "2", name: "United Kingdom", code: "GB", flagEmoji: "🇬🇧" },
  { id: "3", name: "Greece", code: "GR", flagEmoji: "🇬🇷" },
];

interface CountryFormFieldsProps {
  formData: CountryFormData;
  onChange: (field: keyof CountryFormData, value: string) => void;
  idPrefix?: string;
}

const CountryFormFields = ({ formData, onChange, idPrefix = "" }: CountryFormFieldsProps) => (
  <div className="grid gap-4 py-4">
    <div className="grid gap-2">
      <Label htmlFor={`${idPrefix}name`}>Name</Label>
      <Input
        id={`${idPrefix}name`}
        value={formData.name}
        onChange={(e) => onChange("name", e.target.value)}
        placeholder="United States"
      />
    </div>
    <div className="grid gap-2">
      <Label htmlFor={`${idPrefix}code`}>Code</Label>
      <Input
        id={`${idPrefix}code`}
        value={formData.code}
        onChange={(e) => onChange("code", e.target.value)}
        placeholder="US"
      />
    </div>
    <div className="grid gap-2">
      <Label htmlFor={`${idPrefix}flagEmoji`}>Flag Emoji</Label>
      <Input
        id={`${idPrefix}flagEmoji`}
        value={formData.flagEmoji}
        onChange={(e) => onChange("flagEmoji", e.target.value)}
        placeholder="Flag emoji"
      />
    </div>
  </div>
);

export const CountriesTable = () => {
  const [countries, setCountries] = useState<Country[]>(initialCountries);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [formData, setFormData] = useState<CountryFormData>(initialFormData);

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedCountry(null);
    setFormData(initialFormData);
  };

  const handleFormChange = (field: keyof CountryFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = () => {
    const newCountry: Country = {
      id: String(Date.now()),
      ...formData,
    };
    setCountries([...countries, newCountry]);
    closeDialog();
  };

  const handleEdit = () => {
    if (!selectedCountry) return;
    setCountries(
      countries.map((c) =>
        c.id === selectedCountry.id ? { ...c, ...formData } : c
      )
    );
    closeDialog();
  };

  const handleDelete = () => {
    if (!selectedCountry) return;
    setCountries(countries.filter((c) => c.id !== selectedCountry.id));
    closeDialog();
  };

  const openEditDialog = (country: Country) => {
    setSelectedCountry(country);
    setFormData({ name: country.name, code: country.code, flagEmoji: country.flagEmoji });
    setDialogMode("edit");
  };

  const openDeleteDialog = (country: Country) => {
    setSelectedCountry(country);
    setDialogMode("delete");
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Countries</CardTitle>
          <Button size="sm" onClick={() => setDialogMode("create")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Country
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flag</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {countries.map((country) => (
                <TableRow key={country.id}>
                  <TableCell className="text-2xl">{country.flagEmoji}</TableCell>
                  <TableCell className="font-medium">{country.name}</TableCell>
                  <TableCell>{country.code}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(country)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(country)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={dialogMode === "create"} onOpenChange={() => closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Country</DialogTitle>
            <DialogDescription>Add a new country to the list.</DialogDescription>
          </DialogHeader>
          <CountryFormFields formData={formData} onChange={handleFormChange} />
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleCreate}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={dialogMode === "edit"} onOpenChange={() => closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Country</DialogTitle>
            <DialogDescription>Make changes to the country.</DialogDescription>
          </DialogHeader>
          <CountryFormFields formData={formData} onChange={handleFormChange} idPrefix="edit-" />
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={dialogMode === "delete"} onOpenChange={() => closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Country</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCountry?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
