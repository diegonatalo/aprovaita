"use client";

import { useEffect } from "react";
import Link from "next/link";

type ErrorScreenProps = {
  error: unknown;
  retry: () => void;
};

export const ErrorScreen = ({ error, retry }: ErrorScreenProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl space-y-6 py-10 text-center">
      <h1 className="font-display text-2xl font-bold">Algo deu errado</h1>
      <p className="text-muted">
        Esta página encontrou um erro inesperado. Tente de novo ou volte ao início para continuar estudando.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => retry()} className="btn btn-primary">
          Tentar de novo
        </button>
        <Link href="/" className="btn btn-ghost">
          Ir para o início
        </Link>
      </div>
    </div>
  );
};
