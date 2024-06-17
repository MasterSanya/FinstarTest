import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const DataTable = () => {
    // Состояния для хранения данных, текущей страницы, размера страницы, общего количества элементов и страниц, ошибки и фильтра
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('');

    // Функция для загрузки данных с сервера
    const loadData = useCallback(async () => {
        try {
            const params = { page, pageSize, filter }; // Параметры запроса: текущая страница, размер страницы, фильтр
            const response = await axios.get('https://localhost:7212/api/data', { params });
            console.log('Data loaded:', response.data);
            setData(response.data.items);
            setTotalItems(response.data.totalItems);
            setTotalPages(Math.ceil(response.data.totalItems / pageSize));
            setError(''); // Очистить ошибку, если данные успешно загружены
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Не удалось загрузить данные.');
        }
    }, [page, pageSize, filter]);

    // Используем эффект для загрузки данных при изменении страницы, размера страницы или фильтра
    useEffect(() => {
        loadData();
    }, [loadData]);

    // Функция для обработки загрузки файла
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = async (e) => {
            const content = e.target.result;
            try {
                const json = JSON.parse(content); // Парсинг содержимого файла в JSON
                await axios.post('https://localhost:7212/api/data', json); // Отправка данных на сервер
                loadData();
                setError(''); // Очистить ошибку, если файл успешно загружен
            } catch (error) {
                console.error('Error uploading file:', error);
                setError('Некорректный JSON файл.');
            }
        };
        reader.readAsText(file);
    };

    // Функции для перехода на первую и последнюю страницы
    const goToFirstPage = () => setPage(1);
    const goToLastPage = () => setPage(totalPages);

    return (
        <div>
            {/* Элемент для загрузки файла */}
            <input type="file" onChange={handleFileUpload} />
            {/* Отображение ошибки, если она есть */}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div>
                {/* Поле ввода для фильтрации данных по коду или значению */}
                <label>Фильтр по коду или значению:</label>
                <input
                    type="text"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Введите код или значение"
                />
                <button onClick={() => setPage(1)}>Применить фильтр</button>
            </div>
            <div>
                {/* Выпадающий список для выбора размера страницы */}
                <label>Записей на странице:</label>
                <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
            </div>
            {/* Таблица для отображения данных */}
            <table>
                <thead>
                    <tr>
                        <th>Порядковый номер</th>
                        <th>Код</th>
                        <th>Значение</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.code}</td>
                            <td>{item.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                {/* Кнопки для пагинации */}
                <button onClick={goToFirstPage} disabled={page === 1}>&lt;&lt;</button>
                <button onClick={() => setPage(page - 1)} disabled={page === 1}>&lt;</button>
                <span>Страница {page} из {totalPages}</span>
                <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>&gt;</button>
                <button onClick={goToLastPage} disabled={page === totalPages}>&gt;&gt;</button>
            </div>
            {/* Отображение общего количества элементов */}
            <div>Всего элементов: {totalItems}</div>
        </div>
    );
};

export default DataTable;
