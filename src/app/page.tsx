'use client'

import { useEffect, useState } from 'react';
interface Company {
  id: number
  name: string
}

export default function Dashboard() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompanies, setSelectedCompanies] = useState<Set<number>>(new Set())
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/companies?page=${page}&limit=10`);
        const data: Company[] = await response.json()
        setCompanies((prev) => [...prev, ...data])
        setHasMore(data.length > 0)
      } catch (error) {
        console.error('Failed to load companies', error);
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [page])

  const toggleSelectCompany = (id: number) => {
    setSelectedCompanies((prev) => {
      const newSet = new Set(prev)
      newSet.has(id) ? newSet.delete(id) : newSet.add(id)
      return newSet
    })
  }

  const handleDeleteRequest = () => {
    if (selectedCompanies.size === 0) {
      alert('Please select at least one company to delete.')
      return
    }

    // Simulated on sending a delete request here
    const selectedCompanyIds = Array.from(selectedCompanies)
    console.log('Initiating delete request for companies:', selectedCompanyIds)
    // --------------------

    setCompanies((prevCompanies) => 
      prevCompanies.filter((company) => !selectedCompanies.has(company.id))
    )
    setSelectedCompanies(new Set())
  }

  const loadMore = () => {
    if (hasMore && !loading) setPage((prev) => prev + 1)
  }

  return (
    <div className="dashboard">
      <h1>Data Discovery Dashboard</h1>
      <div className="company-list">
        {companies.map((company) => (
          <div key={company.id} className="company-item">
            <input
              type="checkbox"
              checked={selectedCompanies.has(company.id)}
              onChange={() => toggleSelectCompany(company.id)}
            />
            <span>{company.name}</span>
          </div>
        ))}
      </div>
      {loading && <p>Loading...</p>}
      {hasMore && (
        <button onClick={loadMore} disabled={loading}>
          Load More
        </button>
      )}
      <button onClick={handleDeleteRequest} disabled={selectedCompanies.size === 0}>
        Delete Selected Data
      </button>
    </div>
  )
}