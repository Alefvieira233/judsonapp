import "server-only";

export type AsaasBillingType = "PIX" | "CREDIT_CARD" | "BOLETO";
export type AsaasCycle = "MONTHLY" | "QUARTERLY" | "YEARLY";

export type AsaasCustomer = {
  id: string;
  name: string;
  email: string | null;
  cpfCnpj: string | null;
};

export type AsaasSubscription = {
  id: string;
  customer: string;
  status: string;
  value: number;
  cycle: AsaasCycle;
  billingType: AsaasBillingType;
  nextDueDate: string;
};

export type AsaasPayment = {
  id: string;
  subscription: string | null;
  invoiceUrl: string | null;
  bankSlipUrl: string | null;
  status: string;
  value: number;
  dueDate: string;
};

export type AsaasWebhookPayload = {
  id?: string;
  event: string;
  payment?: {
    id: string;
    subscription?: string | null;
    customer?: string;
    value?: number;
    netValue?: number;
    status?: string;
    dueDate?: string;
    paymentDate?: string | null;
    invoiceUrl?: string | null;
  };
};

export function isAsaasEnabled(): boolean {
  return Boolean(process.env.ASAAS_API_KEY && process.env.ASAAS_BASE_URL);
}

function baseUrl(): string {
  // Defensive trim trailing slash — Asaas docs sometimes paste URL with one.
  return (process.env.ASAAS_BASE_URL ?? "").replace(/\/+$/, "");
}

async function asaasFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  if (!isAsaasEnabled()) {
    throw new Error("Asaas not configured");
  }
  const res = await fetch(`${baseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      access_token: process.env.ASAAS_API_KEY!,
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Asaas ${path} ${res.status}: ${body.slice(0, 500)}`);
  }
  return (await res.json()) as T;
}

export async function createCustomer(input: {
  name: string;
  email: string | null;
  cpfCnpj?: string | null;
  mobilePhone?: string | null;
}): Promise<AsaasCustomer> {
  return asaasFetch<AsaasCustomer>("/customers", {
    method: "POST",
    body: JSON.stringify({
      name: input.name,
      email: input.email ?? undefined,
      cpfCnpj: input.cpfCnpj ?? undefined,
      mobilePhone: input.mobilePhone ?? undefined,
    }),
  });
}

export async function createSubscription(input: {
  customerId: string;
  value: number;
  cycle: AsaasCycle;
  billingType: AsaasBillingType;
  description: string;
  nextDueDate: string;
  externalReference?: string;
}): Promise<AsaasSubscription> {
  return asaasFetch<AsaasSubscription>("/subscriptions", {
    method: "POST",
    body: JSON.stringify({
      customer: input.customerId,
      billingType: input.billingType,
      value: input.value,
      cycle: input.cycle,
      nextDueDate: input.nextDueDate,
      description: input.description,
      externalReference: input.externalReference,
    }),
  });
}

export async function cancelSubscription(id: string): Promise<{ deleted: boolean; id: string }> {
  return asaasFetch<{ deleted: boolean; id: string }>(`/subscriptions/${id}`, {
    method: "DELETE",
  });
}

export async function getFirstPayment(subscriptionId: string): Promise<AsaasPayment | null> {
  // Primeira fatura é onde mora o invoiceUrl que abre o checkout (Pix/cartão/boleto)
  // independente do billingType — é o único caminho documentado pra checkout link.
  const data = await asaasFetch<{ data: AsaasPayment[] }>(
    `/subscriptions/${subscriptionId}/payments?limit=1`,
  );
  return data.data?.[0] ?? null;
}

export function verifyWebhookSignature(
  headerToken: string | null | undefined,
  secret: string | null | undefined,
): boolean {
  // Asaas envia o token configurado no painel via header `asaas-access-token`.
  // Comparação constante pra evitar timing leak — secrets curtos cabem em uma
  // única passada.
  if (!headerToken || !secret) return false;
  if (headerToken.length !== secret.length) return false;
  let diff = 0;
  for (let i = 0; i < headerToken.length; i += 1) {
    diff |= headerToken.charCodeAt(i) ^ secret.charCodeAt(i);
  }
  return diff === 0;
}
