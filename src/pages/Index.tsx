
import React, { useState, useEffect, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ViolationReport } from '@/types';
import { subDays } from 'date-fns';
import { violationTypesList } from '@/types';
import SplashScreen from '@/components/SplashScreen';
import { useToast } from "@/hooks/use-toast";
import InstallButton from '@/components/InstallButton';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

const ViolationReportForm = React.lazy(() => import('@/components/ViolationReportForm'));
const ViolationMap = React.lazy(() => import('@/components/ViolationMap'));

const Index = () => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    violationTypesList.map(type => type.id)
  );
  const [showWarning] = useState(true); // Always show warning, no setState to dismiss it
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { toast } = useToast();
  const {
    showInstallButton,
    isCompactButton,
    triggerInstall
  } = useInstallPrompt();

  useEffect(() => {
    const verified = localStorage.getItem("emailVerified");
    if (verified === "true") {
      setIsVerified(true);
    }
  }, []);

  const handleVerified = () => {
    setIsVerified(true);
  };

  const handleResetApp = () => {
    setIsVerified(false);
  };

  const { data: violations = [], isLoading, refetch } = useQuery({
    queryKey: ['violations', 'last-30-days'],
    queryFn: async () => {
      const thirtyDaysAgo = subDays(new Date(), 30).toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('violazioni')
        .select('*')
        .gte('giorni', thirtyDaysAgo);

      if (error) throw error;

      return data.map(violation => ({
        id: violation.id.toString(),
        violationType: violation.tipo || 'other',
        latitude: parseFloat(violation.coordinate?.split(',')[0] || '0'),
        longitude: parseFloat(violation.coordinate?.split(',')[1] || '0'),
        timestamp: violation.giorni,
        municipio: violation.municipio?.toString() || 'N/A'
      })) as ViolationReport[];
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    enabled: isVerified // Only run query when user is verified
  });

  // Dummy function that does nothing since we no longer need to dismiss the warning
  const onWarningDismiss = () => {};

  const handleRefreshData = async () => {
    try {
      await refetch();
      toast({
        title: "Aggiornamento completato",
        description: "I dati della mappa sono stati aggiornati",
      });
    } catch (error) {
      toast({
        title: "Errore di aggiornamento",
        description: "Non è stato possibile aggiornare i dati",
        variant: "destructive",
      });
    }
  };

  if (!isVerified) {
    return <SplashScreen onVerified={handleVerified} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="container px-2">
        <Tabs defaultValue="report" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="report">Segnala Violazione</TabsTrigger>
            <TabsTrigger value="map">Visualizza Mappa</TabsTrigger>
          </TabsList>
          
          <TabsContent value="report">
            <Suspense fallback={<div className="p-4">Caricamento form...</div>}>
              <ViolationReportForm onResetApp={handleResetApp} />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="map">
            <div className="bg-white p-4 rounded-lg shadow">
              {isLoading ? (
                <div className="h-[600px] flex items-center justify-center">
                  <p>Caricamento mappa...</p>
                </div>
              ) : (
                <Suspense fallback={<div className="h-[600px] flex items-center justify-center">
                  <p>Caricamento mappa...</p>
                </div>}>
                  <ViolationMap 
                    violations={violations} 
                    selectedTypes={selectedTypes}
                    onFilterChange={setSelectedTypes}
                    showWarning={showWarning}
                    onWarningDismiss={onWarningDismiss}
                    isFiltersOpen={isFiltersOpen}
                    onFiltersOpenChange={setIsFiltersOpen}
                    onRefresh={handleRefreshData}
                  />
                </Suspense>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {showInstallButton && (
        <InstallButton 
          isCompactButton={isCompactButton}
          onClick={triggerInstall}
        />
      )}
    </div>
  );
};

export default Index;
