'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Table } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Plus, 
  Download, 
  QrCode, 
  Copy,
  Trash2,
  Edit,
  Save,
  X
} from 'lucide-react'
import Link from 'next/link'

export default function QRManager() {
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTable, setEditingTable] = useState<Table | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    table_number: '',
    qr_url: ''
  })

  useEffect(() => {
    fetchTables()
  }, [])

  const fetchTables = async () => {
    try {
      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .order('table_number')
      
      if (error) throw error
      setTables(data || [])
    } catch (error) {
      console.error('Error fetching tables:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      table_number: '',
      qr_url: ''
    })
    setEditingTable(null)
    setIsCreating(false)
  }

  const startEdit = (table: Table) => {
    setEditingTable(table)
    setFormData({
      table_number: table.table_number,
      qr_url: table.qr_url
    })
    setIsCreating(false)
  }

  const startCreate = () => {
    resetForm()
    setIsCreating(true)
  }

  const saveTable = async () => {
    try {
      if (!formData.table_number) {
        alert('Please enter a table number')
        return
      }

      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://wallace.app'
      const qrUrl = formData.qr_url || `${baseUrl}?t=${formData.table_number}`

      if (isCreating) {
        // Create new table
        const { error } = await supabase
          .from('tables')
          .insert({
            table_number: formData.table_number,
            qr_url: qrUrl,
            restaurant_id: 'restaurant-id' // In real app, get from auth
          })
        
        if (error) throw error
      } else if (editingTable) {
        // Update existing table
        const { error } = await supabase
          .from('tables')
          .update({
            table_number: formData.table_number,
            qr_url: qrUrl
          })
          .eq('id', editingTable.id)
        
        if (error) throw error
      }
      
      await fetchTables()
      resetForm()
    } catch (error) {
      console.error('Error saving table:', error)
      alert('Failed to save table')
    }
  }

  const deleteTable = async (tableId: string) => {
    if (!confirm('Are you sure you want to delete this table?')) return
    
    try {
      const { error } = await supabase
        .from('tables')
        .delete()
        .eq('id', tableId)
      
      if (error) throw error
      
      await fetchTables()
    } catch (error) {
      console.error('Error deleting table:', error)
      alert('Failed to delete table')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('URL copied to clipboard!')
  }

  const downloadQR = (table: Table) => {
    // In a real implementation, you would generate an actual QR code image
    // For now, we'll just open the URL in a new tab
    window.open(table.qr_url, '_blank')
  }

  const generateQRUrl = (tableNumber: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://wallace.app'
    return `${baseUrl}?t=${tableNumber}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading QR codes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold">QR Code Manager</h1>
            </div>
            <Button onClick={startCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add Table
            </Button>
          </div>
        </div>
      </header>

      <div className="px-4 py-4">
        {/* Editor Form */}
        {(isCreating || editingTable) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {isCreating ? 'Create New Table' : 'Edit Table'}
                <Button variant="ghost" size="icon" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="table_number">Table Number *</Label>
                <Input
                  id="table_number"
                  value={formData.table_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, table_number: e.target.value }))}
                  placeholder="e.g., 1, A1, Patio-1"
                />
              </div>
              
              <div>
                <Label htmlFor="qr_url">QR Code URL</Label>
                <Input
                  id="qr_url"
                  value={formData.qr_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, qr_url: e.target.value }))}
                  placeholder={`Auto-generated: ${generateQRUrl(formData.table_number)}`}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Leave empty to auto-generate based on table number
                </p>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={saveTable} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {isCreating ? 'Create Table' : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tables Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Tables ({tables.length})</h2>
            <Badge variant="secondary">Active QR Codes</Badge>
          </div>
          
          {tables.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <QrCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No tables yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first table to generate QR codes
                </p>
                <Button onClick={startCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Table
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {tables.map((table) => (
                <Card key={table.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Table {table.table_number}</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => startEdit(table)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => deleteTable(table.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">QR Code URL</Label>
                      <div className="mt-1 p-3 bg-muted rounded-md">
                        <p className="text-sm font-mono break-all">{table.qr_url}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(table.qr_url)}
                        className="flex-1"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy URL
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadQR(table)}
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download QR
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="text-xs text-muted-foreground">
                      <p>Created: {new Date(table.created_at).toLocaleDateString()}</p>
                      <p>Scan this QR code to order from Table {table.table_number}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Use QR Codes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0">1</div>
              <p className="text-sm">Print the QR codes and place them on each table</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0">2</div>
              <p className="text-sm">Customers scan the QR code with their phone camera</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0">3</div>
              <p className="text-sm">They'll be taken directly to the ordering page for their table</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0">4</div>
              <p className="text-sm">Orders will appear in your admin dashboard with the correct table number</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}