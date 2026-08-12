const MENSAJE_GENERICO = 'Ocurrió un error inesperado. Intentá de nuevo en unos minutos.'

const TRADUCCIONES: ReadonlyArray<readonly [RegExp, string]> = [
  [/user already registered|already been registered/i, 'Ya existe una cuenta con ese email. Iniciá sesión o usá otro email.'],
  [/invalid login credentials/i, 'Email o contraseña incorrectos.'],
  [/email not confirmed/i, 'Todavía no confirmaste tu email. Revisá tu casilla y hacé clic en el enlace que te enviamos.'],
  [/password should be at least (\d+)/i, 'La contraseña debe tener al menos $1 caracteres.'],
  [/signup requires a valid password|password.*required/i, 'Ingresá una contraseña válida.'],
  [/unable to validate email address|invalid format/i, 'El email no tiene un formato válido.'],
  [/new password should be different/i, 'La contraseña nueva tiene que ser distinta de la actual.'],
  [/for security purposes.*after (\d+) seconds/i, 'Por seguridad, esperá $1 segundos antes de volver a intentarlo.'],
  [/rate limit exceeded|too many requests/i, 'Hiciste demasiados intentos seguidos. Esperá unos minutos y probá de nuevo.'],
  [/auth session missing|jwt expired|invalid claim/i, 'Tu sesión expiró. Iniciá sesión de nuevo para continuar.'],
  [/row-level security policy/i, 'No tenés permiso para realizar esta acción.'],
  [/conflicting key value violates exclusion constraint|bookings_no_overlap/i, 'Ya hay otra reserva confirmada que se superpone con ese horario. Rechazá o cancelá la otra antes de confirmar esta.'],
  [/duplicate key value violates unique constraint/i, 'Ese registro ya existe.'],
  [/violates foreign key constraint/i, 'No se pudo guardar porque falta un dato relacionado.'],
  [/failed to fetch|network ?error|networkerror/i, 'No pudimos conectarnos al servidor. Revisá tu conexión a internet.'],
  [/payload too large|exceeded the maximum allowed size/i, 'El archivo es demasiado grande.'],
]

function textoCrudo(error: unknown): string {
  if (!error) return ''
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message
  if (typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message ?? '')
  }
  return ''
}

export function mensajeDeError(error: unknown, respaldo: string = MENSAJE_GENERICO): string {
  const crudo = textoCrudo(error).trim()
  if (!crudo) return respaldo

  for (const [patron, traduccion] of TRADUCCIONES) {
    const coincidencia = patron.exec(crudo)
    if (coincidencia) {
      return traduccion.replace(/\$(\d)/g, (_, indice: string) => coincidencia[Number(indice)] ?? '')
    }
  }

  return respaldo
}
