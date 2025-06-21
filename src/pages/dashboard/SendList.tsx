"use client";

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";
const API_KEY = import.meta.env.VITE_API_KEY || ""; // Supondo que a apikey esteja aqui

interface Row {
  title: string;
  description: string;
  rowId: string;
}

interface Section {
  title: string;
  rows: Row[];
}

const SendList = () => {
  const { toast } = useToast();

  const [number, setNumber] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [footerText, setFooterText] = useState("");
  const [sections, setSections] = useState<Section[]>([
    {
      title: "",
      rows: [
        { title: "", description: "", rowId: "" },
      ],
    },
  ]);
  const [delay, setDelay] = useState("0");
  const [loading, setLoading] = useState(false);

  const handleSectionChange = (index: number, field: keyof Section, value: string) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };

  const handleRowChange = (
    sectionIndex: number,
    rowIndex: number,
    field: keyof Row,
    value: string
  ) => {
    const newSections = [...sections];
    newSections[sectionIndex].rows[rowIndex][field] = value;
    setSections(newSections);
  };

  const addSection = () => {
    setSections([...sections, { title: "", rows: [{ title: "", description: "", rowId: "" }] }]);
  };

  const removeSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
  };

  const addRow = (sectionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].rows.push({ title: "", description: "", rowId: "" });
    setSections(newSections);
  };

  const removeRow = (sectionIndex: number, rowIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].rows = newSections[sectionIndex].rows.filter(
      (_, i) => i !== rowIndex
    );
    setSections(newSections);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!number.trim()) {
      toast({
        title: "Erro",
        description: "Número é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: "Erro",
        description: "Título da lista é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    if (sections.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos uma seção.",
        variant: "destructive",
      });
      return;
    }

    for (const section of sections) {
      if (!section.title.trim()) {
        toast({
          title: "Erro",
          description: "Cada seção deve ter um título.",
          variant: "destructive",
        });
        return;
      }
      if (section.rows.length === 0) {
        toast({
          title: "Erro",
          description: "Cada seção deve ter pelo menos uma linha.",
          variant: "destructive",
        });
        return;
      }
      for (const row of section.rows) {
        if (!row.title.trim() || !row.rowId.trim()) {
          toast({
            title: "Erro",
            description: "Cada linha deve ter título e rowId preenchidos.",
            variant: "destructive",
          });
          return;
        }
      }
    }

    const delaySeconds = Number(delay);
    if (isNaN(delaySeconds) || delaySeconds < 0) {
      toast({
        title: "Erro",
        description: "Delay deve ser um número positivo ou zero.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${BACKEND_URL}/message/sendList/instance-id-placeholder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: API_KEY,
          },
          body: JSON.stringify({
            number,
            title,
            description,
            buttonText,
            footerText,
            sections,
            delay: delaySeconds,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao enviar lista");
      }

      toast({
        title: "Sucesso",
        description: "Lista enviada com sucesso.",
        variant: "default",
      });

      // Reset form
      setNumber("");
      setTitle("");
      setDescription("");
      setButtonText("");
      setFooterText("");
      setSections([{ title: "", rows: [{ title: "", description: "", rowId: "" }] }]);
      setDelay("0");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar lista.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-10 flex justify-center">
      <form
        onSubmit={handleSend}
        className="w-full max-w-4xl bg-white/5 backdrop-blur-md rounded-xl p-8 shadow-lg border border-white/10 space-y-6"
      >
        <h1 className="text-3xl font-bold mb-8 select-none drop-shadow-lg text-center">Enviar Lista</h1>
        <div>
          <Label htmlFor="number" className="text-[#CBD5E1]">
            Número (ex: 5511999999999)
          </Label>
          <Input
            id="number"
            type="text"
            placeholder="Número do destinatário"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="bg-black/70 text-[#CBD5E1] placeholder-[#CBD5E1] focus:ring-[#172554] focus:border-transparent rounded-md border border-[#172554]"
            required
          />
        </div>

        <div>
          <Label htmlFor="title" className="text-[#CBD5E1]">
            Título da Lista
          </Label>
          <Input
            id="title"
            type="text"
            placeholder="Título da lista"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-black/70 text-[#CBD5E1] placeholder-[#CBD5E1] focus:ring-[#172554] focus:border-transparent rounded-md border border-[#172554]"
            required
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-[#CBD5E1]">
            Descrição da Lista
          </Label>
          <Input
            id="description"
            type="text"
            placeholder="Descrição da lista"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-black/70 text-[#CBD5E1] placeholder-[#CBD5E1] focus:ring-[#172554] focus:border-transparent rounded-md border border-[#172554]"
          />
        </div>

        <div>
          <Label htmlFor="buttonText" className="text-[#CBD5E1]">
            Texto do Botão
          </Label>
          <Input
            id="buttonText"
            type="text"
            placeholder="Texto do botão"
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
            className="bg-black/70 text-[#CBD5E1] placeholder-[#CBD5E1] focus:ring-[#172554] focus:border-transparent rounded-md border border-[#172554]"
          />
        </div>

        <div>
          <Label htmlFor="footerText" className="text-[#CBD5E1]">
            Texto do Rodapé
          </Label>
          <textarea
            id="footerText"
            placeholder="Texto do rodapé"
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
            className="w-full min-h-[80px] resize-y bg-black/70 text-[#CBD5E1] placeholder-[#CBD5E1] focus:ring-[#172554] focus:border-transparent rounded-md p-3 border border-[#172554]"
          />
        </div>

        {/* Sections */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Seções</h2>
          {sections.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className="mb-6 p-4 border border-white/20 rounded-lg bg-white/10"
            >
              <div className="flex justify-between items-center mb-4">
                <Label htmlFor={`section-title-${sectionIndex}`} className="text-[#CBD5E1]">
                  Título da Seção
                </Label>
                {sections.length > 1 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeSection(sectionIndex)}
                    type="button"
                  >
                    Remover Seção
                  </Button>
                )}
              </div>
              <Input
                id={`section-title-${sectionIndex}`}
                type="text"
                placeholder="Título da seção"
                value={section.title}
                onChange={(e) => handleSectionChange(sectionIndex, "title", e.target.value)}
                className="mb-4 bg-black/70 text-[#CBD5E1] placeholder-[#CBD5E1] focus:ring-[#172554] focus:border-transparent rounded-md border border-[#172554]"
                required
              />

              {/* Rows */}
              <div>
                <h3 className="text-md font-semibold mb-2 text-[#CBD5E1]">Linhas</h3>
                {section.rows.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="mb-4 p-3 border border-white/10 rounded-md bg-black/50"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-[#CBD5E1]">Linha {rowIndex + 1}</Label>
                      {section.rows.length > 1 && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeRow(sectionIndex, rowIndex)}
                          type="button"
                        >
                          Remover Linha
                        </Button>
                      )}
                    </div>
                    <Input
                      type="text"
                      placeholder="Título da linha"
                      value={row.title}
                      onChange={(e) =>
                        handleRowChange(sectionIndex, rowIndex, "title", e.target.value)
                      }
                      className="mb-2 bg-black/70 text-[#CBD5E1] placeholder-[#CBD5E1] focus:ring-[#172554] focus:border-transparent rounded-md border border-[#172554]"
                      required
                    />
                    <Input
                      type="text"
                      placeholder="Descrição da linha"
                      value={row.description}
                      onChange={(e) =>
                        handleRowChange(sectionIndex, rowIndex, "description", e.target.value)
                      }
                      className="mb-2 bg-black/70 text-[#CBD5E1] placeholder-[#CBD5E1] focus:ring-[#172554] focus:border-transparent rounded-md border border-[#172554]"
                    />
                    <Input
                      type="text"
                      placeholder="rowId"
                      value={row.rowId}
                      onChange={(e) =>
                        handleRowChange(sectionIndex, rowIndex, "rowId", e.target.value)
                      }
                      className="bg-black/70 text-[#CBD5E1] placeholder-[#CBD5E1] focus:ring-[#172554] focus:border-transparent rounded-md border border-[#172554]"
                      required
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => addRow(sectionIndex)}
                  className="mt-2"
                >
                  Adicionar Linha
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" onClick={addSection}>
            Adicionar Seção
          </Button>
        </div>

        <div>
          <Label htmlFor="delay" className="text-[#CBD5E1]">
            Delay entre mensagens (segundos)
          </Label>
          <Input
            id="delay"
            type="number"
            min={0}
            step={1}
            placeholder="0"
            value={delay}
            onChange={(e) => setDelay(e.target.value)}
            className="bg-black/70 text-[#CBD5E1] placeholder-[#CBD5E1] focus:ring-[#172554] focus:border-transparent rounded-md border border-[#172554]"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#172554] via-[#0F172A] to-[#172554] hover:from-[#0F172A] hover:via-[#172554] hover:to-[#172554] shadow-lg rounded-full font-semibold text-[#CBD5E1]"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar"}
        </Button>
      </form>
    </div>
  );
};

export default SendList;