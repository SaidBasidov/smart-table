import { cloneTemplate } from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const { tableTemplate, rowTemplate, before, after } = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы

    before.reverse().forEach(item => {                            // перебираем нужный массив идентификаторов
        root[item] = cloneTemplate(item);            // клонируем и получаем объект, сохраняем в таблице
        root.container.prepend(root[item].container);    // добавляем к таблице после (append) или до (prepend)
    });

    after.forEach(item => {                            // перебираем нужный массив идентификаторов
        root[item] = cloneTemplate(item);            // клонируем и получаем объект, сохраняем в таблице
        root.container.append(root[item].container);    // добавляем к таблице после (append) или до (prepend)
    });

    // @todo: #1.3 —  обработать события и вызвать onAction()

    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = Array.isArray(data) ? data.map(item => {
            const row = cloneTemplate(rowTemplate); // { container, elements }

            Object.keys(item).forEach(key => {
                // если cloneTemplate собрал элементы в row.elements по именам полей
                if (row.elements && key in row.elements) {
                    row.elements[key].textContent = item[key] == null ? '' : String(item[key]);
                } else {
                    // fallback: найти ячейку по атрибуту data-name (на случай, если elements не заполнен)
                    const fallback = row.container.querySelector(`[data-name="${key}"]`);
                    if (fallback) fallback.textContent = item[key] == null ? '' : String(item[key]);
                }
            });

            return row.container;
        }) : [];

        root.elements.rows.replaceChildren(...nextRows);
    }

    return { ...root, render };
}