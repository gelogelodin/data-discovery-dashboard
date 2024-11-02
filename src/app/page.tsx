'use client'

import { useEffect, useState, useCallback, useRef } from 'react';
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

  const observerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(`/api/companies?page=${page}&limit=20`);
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

  const getCompanyNames = (selectedCompanies: any) => {
    const selectedCompaniesArr = companies.filter((company) => selectedCompanies.has(company.id));
    if (selectedCompaniesArr.length <= 0){
      return 'There are no selected companies';
    }

    var selectedCompanyNames = '';

    for (var i = 0; i < selectedCompaniesArr.length; i++){
      if (i == 0){
        selectedCompanyNames += selectedCompaniesArr[i].name;
      }
      else{
        selectedCompanyNames += ', ' + selectedCompaniesArr[i].name;
      }
    }

    return selectedCompanyNames;
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
    
    alert('Successfully deleted ' + getCompanyNames(selectedCompanies) + ' companies');
  }

  const loadMore = () => {
    if (hasMore && !loading) setPage((prev) => prev + 1)
  }

  const infiniteScrollRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return
      if (observerRef.current) observerRef.current.disconnect()

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setLoading(true);
          // Added setTimeout as mock of response delay from API Response
          setTimeout(() => {
            loadMore();
          }, 1000);
        }
      })

      if (node) observerRef.current.observe(node)
    },
    [loading, hasMore]
  )

  return (
    <div className="dashboard">
      <h1>Data Discovery Dashboard</h1>
      <div className="company-list">
        {companies.map((company, index) => (
          <div className='company-item' key={company.id} ref={index === companies.length - 1 ? infiniteScrollRef : null}>
            <input
              type="checkbox"
              checked={selectedCompanies.has(company.id)}
              onChange={() => toggleSelectCompany(company.id)}
            />
            <span>{company.name}</span>
          </div>
        ))}
      </div>
      {loading && <p className="text-center mt-2">Loading...</p>}
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