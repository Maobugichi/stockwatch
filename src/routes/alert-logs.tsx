import React, { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, XCircle, Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLoaderData } from "react-router-dom"
import { submitChanges } from "@/lib/utils"
import { MdTune } from 'react-icons/md'

export default function AlertsList() {
  const [editingAlert, setEditingAlert] = useState<any | null>(null)
  const [formData, setFormData] = useState({ condition: "", value: "", active: false })
  const [saving, setSaving] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const alerts = useLoaderData() as any[]
 
  useEffect(() => {
    if (alerts) {
      setLoading(false)
    }
  }, [alerts])

  useEffect(() => {
    console.log(formData)
  }, [formData])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
      </div>
    )
  }

  if (alerts.length === 0) {
    return <p className="text-muted-foreground">No active alerts yet.</p>
  }

  function edit(alert: any) {
    setEditingAlert(alert)
    setFormData({
      condition: alert.condition || "",
      value: alert.value || "",
      active: alert.active
    })
  }

  function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.currentTarget
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="space-y-6 font-inter">
      <div className="bg-white border-b flex top-5 items-center md:justify-start justify-center gap-3 h-20 z-20 text-black">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <span className="h-[90%]"><MdTune /></span>
          Manage Your Alerts
        </h2>
        <Badge className="text-purple-500 bg-gray-200 h-5 py-2">Smart Alerts</Badge>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-[90%] mx-auto md:w-full">
        {alerts.map((alert: any, index: number) => (
          <Card 
            key={alert.alert_id} 
            className="group relative border overflow-hidden bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            style={{ 
              animationDelay: `${index * 100}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          >
            <div className="relative z-10">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold flex items-center gap-3">
                    <div className="w-10 h-10 aspect-square rounded-full bg-black flex items-center justify-center text-white font-bold">
                      <span className="text-base leading-none">{alert.symbol.slice(0, 2)}</span>
                    </div>
                    <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      {alert.symbol}
                    </span>
                  </CardTitle>

                  {alert.active ? (
                    <Badge className="bg-gray-100 text-gray-700 border-0 shadow-sm flex items-center gap-1.5 px-3 py-1">
                      <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-gradient-to-r from-red-500 to-rose-500 text-white border-0 shadow-lg shadow-red-500/25 flex items-center gap-1.5 px-3 py-1">
                      <XCircle className="w-3 h-3" />
                      Inactive
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pb-4">
                <div className="flex flex-wrap gap-2">
                  {alert.conditions.map((c: any, i: number) => (
                    <div
                      key={i}
                      className="px-3 font-jet py-1 rounded-full bg-gradient-to-r from-slate-100 to-slate-200 border border-slate-200 text-slate-700 text-xs font-medium hover:from-blue-100 hover:to-purple-100 hover:border-blue-200 transition-all duration-200"
                    >
                      {c.condition_type.replace("_", " ")} <span className="font-bold text-slate-900">{c.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <Button 
                  className="w-full bg-black border-0 text-white font-medium transition-all duration-200 hover:shadow-xl hover:scale-[1.02] group flex items-center justify-center gap-2 h-8 md:h-10 rounded-sm"
                  onClick={() => edit(alert)}
                >
                  <Edit3 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                  Edit Alert
                </Button>
              </CardFooter>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingAlert} onOpenChange={() => setEditingAlert(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Alert</DialogTitle>
          </DialogHeader>

          <form 
            onSubmit={(e) => submitChanges(e, editingAlert, setSaving, formData, setEditingAlert)} 
            className="space-y-4"
          >
            <Input
              placeholder="condition"
              value={formData.condition}
              type="text"
              name="condition"
              onChange={handleChangeInput}
            />

            <Input
              placeholder="value"
              value={formData.value}
              type="number"
              name="value"
              onChange={handleChangeInput}
            />

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({...formData, active: checked})}
              />
              <span>{formData.active ? "Active" : "Inactive"}</span>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}