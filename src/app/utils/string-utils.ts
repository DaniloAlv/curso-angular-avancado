export class StringUtils {

    public static isNullOrEmpty(valor: string) {
        return valor == undefined || valor == null || valor.trim() == '';
    }

    public static somenteNumeros(valor: string) {
        return valor.replace(/[^0-9]/g, '');
    }
}