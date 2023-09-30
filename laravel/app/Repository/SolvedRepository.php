<?php

namespace App\Repository;

use Carbon\Carbon;
use GuzzleHttp\Exception\RequestException;
use League\OAuth2\Client\Provider\GenericProvider;
use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use function GuzzleHttp\Psr7\str;

class SolvedRepository
{
    private function getToken()
    {
        $provider = new GenericProvider([
            'clientId' => 'e78361fc823b408fae1ff262db8c4c55',
            'clientSecret' => 'RZe8ftzChsgL1CQJyYeecw6Fg779EMwnfJR8/Orc+TisyszE9jKVlgUnHO+OUPkEGeI1dibYSRpw2QY5gqoW3w==',
            'redirectUri' => '/',
            'urlAuthorize' => 'http://brentertainment.com/oauth2/lockdin/authorize', // required but not used
            'urlAccessToken' => 'https://myisolved.com/rest/api/token',
            'urlResourceOwnerDetails' => 'https://myisolved.com/rest/api/clients/userProfile'
        ]);

        try {
            return $accessToken = $provider->getAccessToken('client_credentials');
        } catch (IdentityProviderException $exception) {
            exit($exception->getMessage());
        }
    }

    public function http()
    {
        return new Client([
            'base_uri' => 'https://myisolved.com',
            'headers' => [
                'Authorization' => 'Bearer ' . $this->getToken()
            ]
        ]);
    }

    public function getDepartments()
    {
        $response = $this->http()->get('/rest/api/clients/10812/organizations/23312');
        $data = json_decode($response->getBody());
        return $data->lookups;
    }

    public function getEmployees()
    {
        $response = $this->http()->get("/rest/api/clients/10812/legals/13353/employees?pageSize=500&includeOrganizations=true");
        $data = json_decode($response->getBody());
        return $data->results;
    }

    public function getCustomerServiceRepresentatives()
    {
        $employees = $this->getEmployees();
        $collection = collect($employees);
        return $collection->filter(function ($value, $key) {
            return $value->organizations[0]->value != "Warehouse";
        });
    }

    public function getEmployeeById($id)
    {
        try {
            $response = $this->http()->get("/rest/api/clients/10812/legals/13353/employees/{$id}?includeOrganizations=true");
            return json_decode($response->getBody());
        } catch (RequestException $exception) {
            Log::error(str($exception->getResponse()));
            return null;
        }

    }

    public function getEmployeeByCardNumber($card)
    {
        $employees = $this->getEmployees();
        $collection = collect($employees);
        return $collection->firstWhere('timeclockId', $card);
    }

    public function getTodayPunches($id)
    {
        $year = Carbon::today()->format('Y');
        $month = Carbon::today()->format('m');
        $day = Carbon::today()->format('d');
        try {
            $response = $this->http()->get("/rest/api/clients/10812/legals/13353/employees/{$id}/timecardView/{$year}/{$month}/{$day}");
            $data = json_decode($response->getBody());
            return $data->timecardHours;
        } catch (RequestException $exception) {
            Log::error(str($exception->getResponse()));
            return null;
        }

    }

    public function getTimecardResults($id)
    {
        $year = Carbon::today()->format('Y');
        $month = Carbon::today()->format('m');
        $day = Carbon::today()->format('d');
        try {
            $response = $this->http()->get("/rest/api/clients/10812/legals/13353/employees/{$id}/timecardView/{$year}/{$month}/{$day}?timecardViewMode=day");
            $data = json_decode($response->getBody());
            return $data->timecardHourResults;
        } catch (RequestException $exception) {
            Log::error(str($exception->getResponse()));
            return null;
        }
    }
}