
export default function moneyFormat(value, format) {
    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: format
    });

    return formatter.format(value)
}