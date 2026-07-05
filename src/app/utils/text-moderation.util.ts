export interface TextModerationResult {
  texto: string;
  censurado: boolean;
}

const EXPRESIONES_BLOQUEADAS: RegExp[] = [
  /\b(csm|ctm|ptm)\b/gi,
  /\b(concha\s+(de\s+)?tu\s+madre|conchetumare)\b/gi,
  /\b(huev[oó]n(?:a|es)?|web[oó]n(?:a|es)?|we[oó]n(?:a|es)?)\b/gi,
  /\b(huevada|webada|huevadas|webadas)\b/gi,
  /\b(cojudo|cojuda|cojudos|cojudas)\b/gi,
  /\b(pendejo|pendeja|pendejos|pendejas)\b/gi,
  /\b(mierda|carajo|puta|puto|putas|putos)\b/gi,
  /\b(imb[eé]cil|imb[eé]ciles|idiota|idiotas)\b/gi,
  /\b(cagada|cagadas|conchudo|conchuda|conchudos|conchudas)\b/gi,
  /\b(maric[oó]n|maricones|cabro|cabros)\b/gi,
  /\b(mongolito|mongolita|mongolitos|mongolitas)\b/gi,
  /\b(cholo|serrano|negro)\s+de\s+mierda\b/gi
];

export function censurarTexto(texto: string): TextModerationResult {
  const textoBase = (texto || '').trim().replace(/\s{2,}/g, ' ');
  let censurado = false;
  let textoSeguro = textoBase;

  for (const expresion of EXPRESIONES_BLOQUEADAS) {
    textoSeguro = textoSeguro.replace(expresion, coincidencia => {
      censurado = true;
      return coincidencia.replace(/[^\s]/g, '*');
    });
  }

  return {
    texto: textoSeguro,
    censurado
  };
}
