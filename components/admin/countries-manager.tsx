"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  CountryWithSeasonCount,
  createCountry,
  updateCountry,
  deleteCountry,
} from "@/server-actions/countries";

type DialogMode = "create" | "edit" | "delete" | null;

interface CountryFormData {
  name: string;
  code: string;
  flagImage: string;
}

const initialFormData: CountryFormData = {
  name: "",
  code: "",
  flagImage: "",
};

interface CountriesManagerProps {
  initialCountries: CountryWithSeasonCount[];
}

export const CountriesManager = ({ initialCountries }: CountriesManagerProps) => {
  const [countries, setCountries] = useState<CountryWithSeasonCount[]>(initialCountries);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryWithSeasonCount | null>(null);
  const [formData, setFormData] = useState<CountryFormData>(initialFormData);
  const [isPending, startTransition] = useTransition();

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedCountry(null);
    setFormData(initialFormData);
  };

  const handleFormChange = (field: keyof CountryFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = () => {
    startTransition(async () => {
      const newCountry = await createCountry({
        name: formData.name,
        code: formData.code,
        flagImage: formData.flagImage || undefined,
      });
      setCountries((prev) =>
        [
          ...prev,
          { ...newCountry, _count: { seasons: 0 } },
        ].sort((a, b) => a.name.localeCompare(b.name))
      );
      closeDialog();
    });
  };

  const handleEdit = () => {
    if (!selectedCountry) return;
    startTransition(async () => {
      const updatedCountry = await updateCountry({
        id: selectedCountry.id,
        name: formData.name,
        code: formData.code,
        flagImage: formData.flagImage || undefined,
      });
      setCountries((prev) =>
        prev
          .map((c) =>
            c.id === selectedCountry.id
              ? { ...updatedCountry, _count: c._count }
              : c
          )
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      closeDialog();
    });
  };

  const handleDelete = () => {
    if (!selectedCountry) return;
    startTransition(async () => {
      await deleteCountry(selectedCountry.id);
      setCountries((prev) => prev.filter((c) => c.id !== selectedCountry.id));
      closeDialog();
    });
  };

  const openEditDialog = (country: CountryWithSeasonCount) => {
    setSelectedCountry(country);
    setFormData({
      name: country.name,
      code: country.code,
      flagImage: country.flagImage || "",
    });
    setDialogMode("edit");
  };

  const openDeleteDialog = (country: CountryWithSeasonCount) => {
    setSelectedCountry(country);
    setDialogMode("delete");
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setDialogMode("create")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Country
        </Button>
      </div>

      {countries.length === 0 ? (
        <Card className="border-white/6">
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground text-sm">
              No countries yet. Add your first country to get started.
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {countries.map((country) => (
            <Card
              key={country.id}
              className="group border-white/6 card-glow transition-all duration-300"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-4">
                  {country.flagImage ? (
                    <img
                      src={country.flagImage}
                      alt={`${country.name} flag`}
                      className="h-10 w-14 rounded border border-white/10 object-cover shrink-0"
                    />
                  ) : (
                    <div className="h-10 w-14 rounded border border-white/10 bg-white/5 flex items-center justify-center text-muted-foreground text-[10px] uppercase shrink-0">
                      N/A
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{country.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {country.code}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="shrink-0 border-white/10 text-xs text-muted-foreground"
                  >
                    {country._count.seasons}{" "}
                    {country._count.seasons === 1 ? "season" : "seasons"}
                  </Badge>
                </div>

                <div className="flex items-center gap-1 pt-3 border-t border-white/6">
                  <Button variant="ghost" size="sm" className="flex-1" asChild>
                    <Link href={`/admin/countries/${country.id}/seasons`}>
                      View Seasons
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEditDialog(country)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openDeleteDialog(country)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={dialogMode === "create"} onOpenChange={() => closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Country</DialogTitle>
            <DialogDescription>Add a new country to the list.</DialogDescription>
          </DialogHeader>
          <CountryFormFields
            formData={formData}
            onChange={handleFormChange}
            disabled={isPending}
          />
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isPending}>
              {isPending ? "Creating..." : "Create"}
            </Button>
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
          <CountryFormFields
            formData={formData}
            onChange={handleFormChange}
            idPrefix="edit-"
            disabled={isPending}
          />
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={dialogMode === "delete"} onOpenChange={() => closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Country</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCountry?.name}? This will
              also delete all seasons, episodes, and questions. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={isPending}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface CountryFormFieldsProps {
  formData: CountryFormData;
  onChange: (field: keyof CountryFormData, value: string) => void;
  idPrefix?: string;
  disabled?: boolean;
}

const CountryFormFields = ({
  formData,
  onChange,
  idPrefix = "",
  disabled,
}: CountryFormFieldsProps) => (
  <div className="grid gap-4 py-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}name`}>Name</Label>
        <Input
          id={`${idPrefix}name`}
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="United Kingdom"
          disabled={disabled}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}code`}>Code</Label>
        <Input
          id={`${idPrefix}code`}
          value={formData.code}
          onChange={(e) => onChange("code", e.target.value)}
          placeholder="GB"
          maxLength={2}
          disabled={disabled}
        />
      </div>
    </div>
    <div className="grid gap-2">
      <Label>Flag Image</Label>
      <ImageUpload
        value={formData.flagImage}
        onChange={(url) => onChange("flagImage", url)}
        disabled={disabled}
      />
    </div>
  </div>
);
