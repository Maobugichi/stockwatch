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
import AlertsHeader from "@/components/ui/alert/alert-heading"

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
    <div className="space-y-6 relative font-inter">
      <AlertsHeader/>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-[90%] mx-auto md:w-[95%]">
        {alerts.map((alert: any, index: number) => (
          <Card 
            key={alert.alert_id} 
            className="group border border-[rgba(34,36,45,0.5)] relative rounded-3xl overflow-hidden bg-[#14151C]/40 backdrop-blur-sm shadow-sm  transition-all duration-300 h-[200px]"
            style={{ 
              animationDelay: `${index * 100}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          >
            <div className="relative z-10 mt-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold flex items-center gap-3">
                    <div className="w-10 h-10 aspect-square rounded-full bg-black flex items-center justify-center text-white font-bold">
                      <span className="text-base leading-none">{alert.symbol.slice(0, 2)}</span>
                    </div>
                    <span className="text-white">
                      {alert.symbol}
                    </span>
                  </CardTitle>

                  {alert.active ? (
                    <Badge className="bg-green-600/20 border-green-600 rounded-xl   border text-white shadow-sm flex items-center gap-1.5 px-3 py-1">
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
                      className="px-3 font-jet py-1 rounded-full bg-[#526FFF]/20 border border-[#526FFF] text-[#526FFF] text-xs font-medium hover:from-blue-100 hover:to-purple-100 hover:border-blue-200 transition-all duration-200"
                    >
                      {c.condition_type.replace("_", " ")} <span className="font-bold text-[#526FFF]">{c.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <Button 
                  className="w-full bg-black border-0 rounded-lg text-white font-medium transition-all duration-200 hover:shadow-xl hover:scale-[1.02] group flex items-center justify-center gap-2 h-12 md:h-10 "
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