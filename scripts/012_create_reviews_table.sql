-- Create reviews table for CampusEats
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  vendor_id UUID NOT NULL,
  delivery_person_id UUID,
  
  -- Ratings
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  food_rating INTEGER CHECK (food_rating >= 1 AND food_rating <= 5),
  delivery_rating INTEGER CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
  
  -- Review content
  comment TEXT,
  
  -- Vendor response
  vendor_response TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  
  -- Moderation
  is_flagged BOOLEAN DEFAULT FALSE,
  flagged_reason TEXT,
  is_approved BOOLEAN DEFAULT TRUE,
  moderated_by UUID,
  moderated_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_reviews_vendor ON reviews(vendor_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_order ON reviews(order_id);
CREATE INDEX idx_reviews_delivery ON reviews(delivery_person_id);
CREATE INDEX idx_reviews_rating ON reviews(overall_rating);
CREATE INDEX idx_reviews_flagged ON reviews(is_flagged) WHERE is_flagged = TRUE;

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view approved reviews"
  ON reviews FOR SELECT
  USING (is_approved = TRUE);

CREATE POLICY "Users can create reviews for their own orders"
  ON reviews FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_id 
      AND orders.user_id = auth.uid()
      AND orders.status = 'delivered'
    )
  );

CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Vendors can view their reviews"
  ON reviews FOR SELECT
  USING (
    vendor_id IN (
      SELECT user_id FROM vendor_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Vendors can respond to reviews"
  ON reviews FOR UPDATE
  USING (
    vendor_id IN (
      SELECT user_id FROM vendor_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all reviews"
  ON reviews FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.uid = auth.uid() 
      AND users.role IN ('admin', 'sub_admin')
    )
  );
