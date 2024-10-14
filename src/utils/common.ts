export const matchPaths = (pathname: string, paths: string[]): boolean => {
  const regexPaths = paths.map(
    (path) =>
      path
        .replace(/\[.*?\]/g, "[^/]+") // Заменяем динамические части в квадратных скобках
        .replace(/\/\*/g, "(/.*)?") // Обрабатываем / * как необязательные подкаталоги
        .replace(/\*/g, ".*") // Обрабатываем * без слэша как любой символ
        .replace(/\/$/, "") // Убираем завершающий слеш для совпадения
  );

  const regex = new RegExp(`^(${regexPaths.join("|")})$`);

  return regex.test(pathname);
};
