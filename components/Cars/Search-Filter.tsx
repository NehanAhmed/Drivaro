
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { IconFilter, IconSearch } from '@tabler/icons-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const SearchFilter = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedTransmission, setSelectedTransmission] = useState('all')

    // Initialize state from URL params on mount
    useEffect(() => {
        if (searchParams) {
            setSearchQuery(searchParams.get('q') || '')
            setSelectedCategory(searchParams.get('category') || 'all')
            setSelectedTransmission(searchParams.get('transmission') || 'all')
        }
    }, [searchParams])

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams?.toString() || '')

        // Add or remove search query param
        if (searchQuery.trim()) {
            params.set('q', searchQuery.trim())
        } else {
            params.delete('q')
        }

        // Add or remove category param
        if (selectedCategory && selectedCategory !== 'all') {
            params.set('category', selectedCategory)
        } else {
            params.delete('category')
        }

        // Add or remove transmission param
        if (selectedTransmission && selectedTransmission !== 'all') {
            params.set('transmission', selectedTransmission)
        } else {
            params.delete('transmission')
        }

        const queryString = params.toString()
        router.push(`${pathname}${queryString ? `?${queryString}` : ''}`)
    }



    return (
        <div className="w-fit rounded-xl max-w-4xl mx-auto border border-border shadow-lg">
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                    {/* Search Input */}
                    <div className="md:col-span-5 space-y-2">
                        <Label htmlFor="search" className="text-sm font-medium">
                            Search
                        </Label>
                        <div className="relative">
                            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="search"
                                placeholder="Search by make or model..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="category" className="text-sm font-medium">
                            Category
                        </Label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger id="category">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="Sedan">Sedan</SelectItem>
                                <SelectItem value="SUV">SUV</SelectItem>
                                <SelectItem value="Hatchback">Hatchback</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Transmission Filter */}
                    <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="transmission" className="text-sm font-medium">
                            Transmission
                        </Label>
                        <Select value={selectedTransmission} onValueChange={setSelectedTransmission}>
                            <SelectTrigger id="transmission">
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="Automatic">Automatic</SelectItem>
                                <SelectItem value="Manual">Manual</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Search Button */}
                    <div className="md:col-span-1 flex justify-start items-end">
                        <Button 
                            className="w-full" 
                            size="icon"
                            onClick={applyFilters}
                            type="button"
                        >
                            <IconFilter className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchFilter