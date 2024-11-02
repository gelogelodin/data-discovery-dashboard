import { NextResponse } from 'next/server';
import { Company } from '../../types/types';

function randomCompanyName(index:number){
  return `Company ${String.fromCharCode(65 + (index % 26))}${index + 1}`;
}

const companies: Company[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: randomCompanyName(i),
}))

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  const start = (page - 1) * limit
  const end = page * limit
  const paginatedCompanies = companies.slice(start, end)

  return NextResponse.json(paginatedCompanies)
}