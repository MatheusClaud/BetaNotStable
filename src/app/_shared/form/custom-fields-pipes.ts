
export function cepPipeFormat(str: string): string {
    let maxLength = 8;
    let value = str.replace(/\D/g, '');

    if (value.length >= maxLength) {
        value = value.slice(0, maxLength);
    }

    if (value.length >= 8) {
        value = value.replace(/^(\d{5})(\d+)/, '$1-$2');
    } 
    return value;
}

export function datePipeFormat(str: string): string {
    let maxLength = 8;
    let value = str.replace(/\D/g, '');

    if (value.length > maxLength) {
      value = value.slice(0, maxLength);
    }

    if (value.length > 4) {
      value = value.replace(/^(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d+)/, '$1/$2');
    }

  return value
}



export function cpfPipeFormat(str: string): string {
    let maxLength = 11;
    let value = str.replace(/\D/g, '');

    if (value.length > maxLength) {
      value = value.slice(0, maxLength);
    }

    if (value.length > 3 && value.length < 7) {
      value = value.replace(/^(\d{3})(\d+)/, '$1.$2');
    } else if (value.length >= 7 && value.length < 10) {
      value = value.replace(/^(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    } else {
      value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
    }

    return value
}

export function cnpjPipeFormat(str: string): string {
    let maxLength = 14;
    let value = str.replace(/\D/g, '');

    if (value.length > maxLength) {
      value = value.slice(0, maxLength);
    }

    value = value.replace(/^(\d{2})(\d)/, '$1.$2');
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');

    return value;
}

export function brazilianCurrencyFormat(input: string): string {
  let cleaned = input.replace(/[^\d.]/g, '');

  if (cleaned.includes('.')) {
    const [intPart, decPart] = cleaned.split('.');
    const limitedDec = decPart.slice(0, 2); // keep only two decimals
    cleaned = `${intPart}.${limitedDec}`;
  }

  if (cleaned.length > 0) {
    return `R$ ${cleaned}`;  
  }
  else {
    return ""
  }
}

export function dateWithHourFormat(dateString: string): string {
  const date = new Date(dateString);

  const pad = (n: number) => String(n).padStart(2, '0');

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1); // months are 0-based
  const year = date.getFullYear();

  return `${day}/${month}/${year} - ${hours}:${minutes}`;
}

export function phonePipeFormat(str: string): string {
    let maxLength = 11;
    let value = str.replace(/\D/g, '');

    if (value.length > maxLength) {
      value = value.slice(0, maxLength);
    }

    if (value.length >= 8) {
      value = value.replace(/^(\d{2})(\d{5})(\d+)/, '($1) $2 - $3');
    } 
    if (value.length >= 2 && value.length) {
      value = value.replace(/^(\d{2})(\d+)/, '($1) $2');
    } else if (value.length > 7) {
      value = value.replace(/^(\d{2})(\d{5})(\d+)/, '($1) $2 - $3');
    }
    return value
}

export function currencyPipeFormat(str: string): string {
    let value = str.replace(/\D/g, '');

    if (value === '') {
        return '';
    }

    const numberValue = parseInt(value, 10) / 100;

    const formattedValue = numberValue.toFixed(2).replace('.', ',');

    return `R$ ${formattedValue}`;
}

export function formatDateToDDMMYYYY(dateString: string): string {
    if (!dateString) {
        return '';
    }

    const datePart = dateString.split('T')[0];
    const [year, month, day] = datePart.split('-');

    return `${day}/${month}/${year}`;
}

export function stripCountryCode(phoneNumber: string): string {
    if (phoneNumber && phoneNumber.startsWith('+')) {
        return phoneNumber.substring(3);
    }
    return phoneNumber;
}