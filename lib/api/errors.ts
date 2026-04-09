export class ApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

const ERROR_CODES: Record<string, string> = {
  EMAIL_TAKEN: "Este correo ya esta en uso",
  USERNAME_TAKEN: "Este nombre de usuario ya esta en uso",
  INVALID_CREDENTIALS: "Correo o contraseña incorrectos",
  INVALID_REFRESH_TOKEN: "Tu sesion ha expirado. Inicia sesion nuevamente",
  INVALID_TOKEN: "El enlace ha expirado o no es valido",
  PASSWORD_TOO_SHORT: "La contraseña debe tener al menos 8 caracteres",
  UNAUTHORIZED: "Debes iniciar sesion",
  CART_EMPTY: "El carrito esta vacio",
  ORDER_ALREADY_CANCELLED: "La orden ya fue cancelada",
  PRODUCT_UNAVAILABLE: "Producto no disponible",
  INSUFFICIENT_STOCK: "Stock insuficiente",
  OUT_OF_STOCK: "Sin stock disponible",
  COUPON_EXPIRED: "El cupon ha expirado",
  COUPON_LIMIT_REACHED: "El cupon alcanzo su limite de uso",
  COUPON_MIN_PURCHASE: "El pedido no alcanza el monto minimo para este cupon",
  TENANT_NOT_FOUND: "Tienda no encontrada",
  NOT_FOUND: "Recurso no encontrado",
  VALIDATION: "Datos ingresados no son validos",
  VALIDATION_ERROR: "Datos ingresados no son validos",
  INTERNAL: "Error del servidor. Intenta mas tarde",
  INTERNAL_ERROR: "Error del servidor. Intenta mas tarde",
  BAD_REQUEST: "Solicitud no valida",
  FORBIDDEN: "Acceso denegado",
};

const RUNTIME_PATTERNS: [RegExp, string][] = [
  [/failed to fetch|fetch failed|networkerror/i, "Error de conexion. Verifica tu internet"],
  [/abort|cancel/i, "La solicitud fue cancelada"],
  [/timeout|timed?\s*out/i, "La solicitud tardo demasiado. Intenta de nuevo"],
];

const FALLBACK = "Ocurrio un error inesperado";
const HAS_ENGLISH = /\b(error|failed|not found|invalid|unauthorized|forbidden|timeout|cannot|unable)\b/i;

export function mapErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    return ERROR_CODES[err.code] ?? FALLBACK;
  }
  const raw = typeof err === "string" ? err : err instanceof Error ? err.message : "";
  if (!raw) return FALLBACK;
  for (const [pattern, msg] of RUNTIME_PATTERNS) {
    if (pattern.test(raw)) return msg;
  }
  if (!HAS_ENGLISH.test(raw)) return raw;
  return FALLBACK;
}

export async function parseErrorResponse(
  res: Response
): Promise<{ code: string; message: string }> {
  let code = `HTTP_${res.status}`;
  let message = res.statusText || "Unknown error";
  try {
    const body = await res.json();
    if (body?.error?.code) {
      code = body.error.code;
      message = body.error.message ?? message;
    } else if (typeof body?.code === "string") {
      code = body.code;
      message = body.message ?? message;
    } else if (typeof body?.message === "string") {
      message = body.message;
    }
  } catch {
    // not JSON
  }
  return { code, message };
}
