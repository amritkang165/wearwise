"use server";

export interface WeatherResult {
  temperature: number | null;
  condition: string | null;
}

export async function getCurrentWeather(
  lat: number,
  lon: number
): Promise<WeatherResult> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return { temperature: null, condition: null };

  const data = await res.json();
  const temp = data?.current?.temperature_2m;
  const code = data?.current?.weather_code;

  return {
    temperature: typeof temp === "number" ? Math.round(temp) : null,
    condition: typeof code === "number" ? describeWeather(code) : null,
  };
}

function describeWeather(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Foggy";
  if (code >= 51 && code <= 67) return "Rainy";
  if (code >= 71 && code <= 77) return "Snowy";
  if (code >= 80 && code <= 82) return "Rain showers";
  if (code >= 85 && code <= 86) return "Snow showers";
  if (code >= 95) return "Thunderstorm";
  return "Mild";
}
