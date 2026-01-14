<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Country;
use App\Models\Department;
use Illuminate\Database\Seeder;

class GeographicSeeder extends Seeder
{
    public function run(): void
    {
        // Colombia
        $colombia = Country::create([
            'code' => 'COL',
            'name' => 'Colombia',
            'phone_code' => '+57',
        ]);

        $departments = [
            ['code' => '05', 'name' => 'Antioquia', 'cities' => ['Medellín', 'Bello', 'Itagüí', 'Envigado', 'Rionegro']],
            ['code' => '08', 'name' => 'Atlántico', 'cities' => ['Barranquilla', 'Soledad', 'Malambo']],
            ['code' => '11', 'name' => 'Bogotá D.C.', 'cities' => ['Bogotá']],
            ['code' => '13', 'name' => 'Bolívar', 'cities' => ['Cartagena', 'Magangué', 'Turbaco']],
            ['code' => '15', 'name' => 'Boyacá', 'cities' => ['Tunja', 'Duitama', 'Sogamoso']],
            ['code' => '17', 'name' => 'Caldas', 'cities' => ['Manizales', 'La Dorada', 'Villamaría']],
            ['code' => '18', 'name' => 'Caquetá', 'cities' => ['Florencia', 'San Vicente del Caguán']],
            ['code' => '19', 'name' => 'Cauca', 'cities' => ['Popayán', 'Santander de Quilichao']],
            ['code' => '20', 'name' => 'Cesar', 'cities' => ['Valledupar', 'Aguachica']],
            ['code' => '23', 'name' => 'Córdoba', 'cities' => ['Montería', 'Lorica', 'Cereté']],
            ['code' => '25', 'name' => 'Cundinamarca', 'cities' => ['Soacha', 'Girardot', 'Facatativá', 'Zipaquirá', 'Chía']],
            ['code' => '27', 'name' => 'Chocó', 'cities' => ['Quibdó', 'Istmina']],
            ['code' => '41', 'name' => 'Huila', 'cities' => ['Neiva', 'Pitalito', 'Garzón']],
            ['code' => '44', 'name' => 'La Guajira', 'cities' => ['Riohacha', 'Maicao']],
            ['code' => '47', 'name' => 'Magdalena', 'cities' => ['Santa Marta', 'Ciénaga']],
            ['code' => '50', 'name' => 'Meta', 'cities' => ['Villavicencio', 'Acacías', 'Granada']],
            ['code' => '52', 'name' => 'Nariño', 'cities' => ['Pasto', 'Tumaco', 'Ipiales']],
            ['code' => '54', 'name' => 'Norte de Santander', 'cities' => ['Cúcuta', 'Ocaña', 'Pamplona']],
            ['code' => '63', 'name' => 'Quindío', 'cities' => ['Armenia', 'Calarcá', 'Montenegro']],
            ['code' => '66', 'name' => 'Risaralda', 'cities' => ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal']],
            ['code' => '68', 'name' => 'Santander', 'cities' => ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Barrancabermeja']],
            ['code' => '70', 'name' => 'Sucre', 'cities' => ['Sincelejo', 'Corozal']],
            ['code' => '73', 'name' => 'Tolima', 'cities' => ['Ibagué', 'Espinal', 'Melgar']],
            ['code' => '76', 'name' => 'Valle del Cauca', 'cities' => ['Cali', 'Buenaventura', 'Palmira', 'Tuluá', 'Cartago', 'Buga']],
            ['code' => '81', 'name' => 'Arauca', 'cities' => ['Arauca', 'Saravena']],
            ['code' => '85', 'name' => 'Casanare', 'cities' => ['Yopal', 'Aguazul']],
            ['code' => '86', 'name' => 'Putumayo', 'cities' => ['Mocoa', 'Puerto Asís']],
            ['code' => '88', 'name' => 'San Andrés', 'cities' => ['San Andrés']],
            ['code' => '91', 'name' => 'Amazonas', 'cities' => ['Leticia']],
            ['code' => '94', 'name' => 'Guainía', 'cities' => ['Inírida']],
            ['code' => '95', 'name' => 'Guaviare', 'cities' => ['San José del Guaviare']],
            ['code' => '97', 'name' => 'Vaupés', 'cities' => ['Mitú']],
            ['code' => '99', 'name' => 'Vichada', 'cities' => ['Puerto Carreño']],
        ];

        foreach ($departments as $deptData) {
            $department = Department::create([
                'country_id' => $colombia->id,
                'code' => $deptData['code'],
                'name' => $deptData['name'],
            ]);

            foreach ($deptData['cities'] as $cityName) {
                City::create([
                    'department_id' => $department->id,
                    'name' => $cityName,
                ]);
            }
        }

        // Otros países comunes
        $otherCountries = [
            ['code' => 'USA', 'name' => 'Estados Unidos', 'phone_code' => '+1'],
            ['code' => 'MEX', 'name' => 'México', 'phone_code' => '+52'],
            ['code' => 'ECU', 'name' => 'Ecuador', 'phone_code' => '+593'],
            ['code' => 'PER', 'name' => 'Perú', 'phone_code' => '+51'],
            ['code' => 'VEN', 'name' => 'Venezuela', 'phone_code' => '+58'],
            ['code' => 'BRA', 'name' => 'Brasil', 'phone_code' => '+55'],
            ['code' => 'ARG', 'name' => 'Argentina', 'phone_code' => '+54'],
            ['code' => 'CHL', 'name' => 'Chile', 'phone_code' => '+56'],
            ['code' => 'PAN', 'name' => 'Panamá', 'phone_code' => '+507'],
            ['code' => 'ESP', 'name' => 'España', 'phone_code' => '+34'],
            ['code' => 'CHN', 'name' => 'China', 'phone_code' => '+86'],
        ];

        foreach ($otherCountries as $countryData) {
            Country::create($countryData);
        }
    }
}
